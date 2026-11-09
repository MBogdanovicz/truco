import 'dart:math' as math;

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'app_icons.dart';
import 'glass.dart';
import 'platform_style.dart';

export 'app_icons.dart';
export 'platform_style.dart' show PlatformStyleContext;

/// Window size classes (Material 3 breakpoints).
abstract final class AppBreakpoints {
  /// Tablets in portrait and up: content gets a max width, menus a grid.
  static const medium = 600.0;

  /// Tablets in landscape and desktops.
  static const expanded = 840.0;
}

extension AppLayoutContext on BuildContext {
  double get windowWidth => MediaQuery.sizeOf(this).width;
}

/// Page scaffold with a platform-appropriate navigation bar.
///
/// Pass [body] for a free-form page, or [children] for a scrolling list
/// page (large collapsing title on the iOS look, pull to refresh with
/// [onRefresh]). Content is centered and limited to [maxWidth] so it
/// doesn't stretch across tablets and desktops; null means full width.
class AppScaffold extends StatelessWidget {
  const AppScaffold({
    super.key,
    required this.title,
    this.body,
    this.children,
    this.actions = const [],
    this.backgroundColor,
    this.barColor,
    this.maxWidth = 720,
    this.onRefresh,
    this.largeTitle = false,
  }) : assert((body == null) != (children == null));

  final String title;
  final Widget? body;
  final List<Widget>? children;
  final List<Widget> actions;
  final Color? backgroundColor;

  /// Dark navigation bar color; its title and icons become white.
  final Color? barColor;
  final double? maxWidth;
  final Future<void> Function()? onRefresh;

  /// Material only: big collapsing title (the iOS look always uses one on
  /// list pages).
  final bool largeTitle;

  @override
  Widget build(BuildContext context) {
    if (context.isCupertino) {
      final page = children != null
          ? _cupertinoList(context)
          : _cupertinoBody(context);
      // Invisible Material Scaffold so the ScaffoldMessenger has somewhere to
      // show SnackBars (toasts); without it they never appear on the PWA.
      return Scaffold(
        backgroundColor: Colors.transparent,
        resizeToAvoidBottomInset: false,
        body: backgroundColor == null ? GlassBackground(child: page) : page,
      );
    }
    return children != null ? _materialList(context) : _materialBody(context);
  }

  Widget _limit(Widget child) => maxWidth == null
      ? child
      : Align(
          alignment: Alignment.topCenter,
          child: ConstrainedBox(
            constraints: BoxConstraints(maxWidth: maxWidth!),
            child: child,
          ),
        );

  double _side(double width) => math.max(16, (width - (maxWidth ?? width)) / 2);

  Widget? _trailing(Color? color) => actions.isEmpty
      ? null
      : IconTheme.merge(
          data: IconThemeData(color: color),
          child: Row(mainAxisSize: MainAxisSize.min, children: actions),
        );

  Widget _cupertinoBody(BuildContext context) {
    final onBar = barColor == null ? null : Colors.white;
    final scaffold = CupertinoPageScaffold(
      backgroundColor: backgroundColor ?? Colors.transparent,
      navigationBar: CupertinoNavigationBar(
        backgroundColor: barColor ?? glassBarColor(context),
        border: null,
        leading: onBar != null && Navigator.of(context).canPop()
            ? CupertinoNavigationBarBackButton(color: onBar)
            : null,
        middle: Text(
          title,
          style: onBar == null ? null : TextStyle(color: onBar),
        ),
        trailing: _trailing(onBar),
      ),
      // Material ancestor so shared Material widgets (InkWell, Text styles)
      // keep working inside Cupertino pages.
      child: Material(
        type: MaterialType.transparency,
        child: SafeArea(child: _limit(body!)),
      ),
    );
    if (onBar == null) return scaffold;
    return CupertinoTheme(
      data: CupertinoTheme.of(context).copyWith(primaryColor: onBar),
      child: scaffold,
    );
  }

  Widget _cupertinoList(BuildContext context) => LayoutBuilder(
    builder: (context, constraints) {
      final side = _side(constraints.maxWidth);
      // On tablets and desktops the large title would sit far from the
      // centered content (and iOS collapses it in landscape), so it becomes
      // a heading aligned with the content instead.
      final wide = constraints.maxWidth >= AppBreakpoints.medium;
      const physics = AlwaysScrollableScrollPhysics(
        parent: BouncingScrollPhysics(),
      );
      SliverPadding content(BuildContext context) => SliverPadding(
        padding: EdgeInsets.fromLTRB(side, wide ? 24 : 8, side, 32),
        sliver: SliverList.list(
          children: [
            if (wide)
              Padding(
                padding: const EdgeInsets.fromLTRB(4, 0, 4, 20),
                child: Text(
                  title,
                  style: CupertinoTheme.of(context)
                      .textTheme
                      .navLargeTitleTextStyle,
                ),
              ),
            ...children!,
          ],
        ),
      );
      final refresh = onRefresh == null
          ? null
          : CupertinoSliverRefreshControl(onRefresh: onRefresh);
      if (!wide) {
        return CupertinoPageScaffold(
          backgroundColor: Colors.transparent,
          child: Material(
            type: MaterialType.transparency,
            child: CustomScrollView(
              physics: physics,
              slivers: [
                CupertinoSliverNavigationBar(
                  largeTitle: Text(title),
                  backgroundColor: glassBarColor(context),
                  border: null,
                  trailing: _trailing(null),
                ),
                ?refresh,
                SliverSafeArea(top: false, sliver: content(context)),
              ],
            ),
          ),
        );
      }
      return CupertinoPageScaffold(
        backgroundColor: Colors.transparent,
        navigationBar: CupertinoNavigationBar(
          backgroundColor: glassBarColor(context),
          border: null,
          trailing: _trailing(null),
        ),
        child: Builder(
          builder: (context) => Material(
            type: MaterialType.transparency,
            child: CustomScrollView(
              physics: physics,
              slivers: [
                SliverToBoxAdapter(
                  child: SizedBox(height: MediaQuery.paddingOf(context).top),
                ),
                ?refresh,
                SliverSafeArea(top: false, sliver: content(context)),
              ],
            ),
          ),
        ),
      );
    },
  );

  Widget _materialBody(BuildContext context) => Scaffold(
    backgroundColor: backgroundColor,
    appBar: AppBar(
      title: Text(title),
      actions: actions,
      backgroundColor: barColor,
      foregroundColor: barColor == null ? null : Colors.white,
    ),
    body: SafeArea(child: _limit(body!)),
  );

  Widget _materialList(BuildContext context) => Scaffold(
    body: LayoutBuilder(
      builder: (context, constraints) {
        final side = _side(constraints.maxWidth);
        final view = CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: [
            if (largeTitle)
              SliverAppBar.large(title: Text(title), actions: actions)
            else
              SliverAppBar(pinned: true, title: Text(title), actions: actions),
            SliverSafeArea(
              top: false,
              sliver: SliverPadding(
                padding: EdgeInsets.fromLTRB(side, 8, side, 32),
                sliver: SliverList.list(children: children!),
              ),
            ),
          ],
        );
        return onRefresh == null
            ? view
            : RefreshIndicator(onRefresh: onRefresh!, child: view);
      },
    ),
  );
}

/// Primary call-to-action button; [tonal] makes it a softer secondary one.
class AppButton extends StatelessWidget {
  const AppButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.tonal = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final bool tonal;

  @override
  Widget build(BuildContext context) {
    final child = icon == null
        ? Text(label, textAlign: TextAlign.center)
        : Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 20),
              const SizedBox(width: 8),
              Flexible(child: Text(label, overflow: TextOverflow.ellipsis)),
            ],
          );
    if (context.isCupertino) {
      // Capsule buttons, as in iOS 26.
      final radius = BorderRadius.circular(999);
      return tonal
          ? CupertinoButton.tinted(
              borderRadius: radius,
              onPressed: onPressed,
              child: child,
            )
          : CupertinoButton.filled(
              borderRadius: radius,
              onPressed: onPressed,
              child: child,
            );
    }
    return tonal
        ? FilledButton.tonal(onPressed: onPressed, child: child)
        : FilledButton(onPressed: onPressed, child: child);
  }
}

/// Secondary, low-emphasis button.
class AppTextButton extends StatelessWidget {
  const AppTextButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.destructive = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool destructive;

  @override
  Widget build(BuildContext context) {
    final color = destructive
        ? (context.isCupertino
              ? CupertinoColors.destructiveRed
              : Theme.of(context).colorScheme.error)
        : null;
    final text = Text(
      label,
      textAlign: TextAlign.center,
      style: color == null ? null : TextStyle(color: color),
    );
    if (context.isCupertino) {
      return CupertinoButton(onPressed: onPressed, child: text);
    }
    return TextButton(onPressed: onPressed, child: text);
  }
}

/// Single-line text input.
class AppTextField extends StatelessWidget {
  const AppTextField({
    super.key,
    required this.controller,
    required this.label,
    this.keyboardType,
    this.autofocus = false,
    this.maxLength,
    this.onSubmitted,
    this.textCapitalization = TextCapitalization.none,
    this.inputFormatters,
    this.autofillHints,
  });

  final TextEditingController controller;
  final String label;
  final TextInputType? keyboardType;
  final bool autofocus;
  final int? maxLength;
  final ValueChanged<String>? onSubmitted;
  final TextCapitalization textCapitalization;
  final List<TextInputFormatter>? inputFormatters;
  final Iterable<String>? autofillHints;

  @override
  Widget build(BuildContext context) {
    if (context.isCupertino) {
      return CupertinoTextField(
        controller: controller,
        placeholder: label,
        keyboardType: keyboardType,
        autofocus: autofocus,
        maxLength: maxLength,
        onSubmitted: onSubmitted,
        textCapitalization: textCapitalization,
        inputFormatters: inputFormatters,
        autofillHints: autofillHints,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: CupertinoColors.tertiarySystemFill.resolveFrom(context),
          borderRadius: BorderRadius.circular(14),
        ),
      );
    }
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        border: const OutlineInputBorder(),
        counterText: '',
      ),
      keyboardType: keyboardType,
      autofocus: autofocus,
      maxLength: maxLength,
      onSubmitted: onSubmitted,
      textCapitalization: textCapitalization,
      inputFormatters: inputFormatters,
      autofillHints: autofillHints,
    );
  }
}

/// Search box: iOS search field or Material search bar.
class AppSearchField extends StatelessWidget {
  const AppSearchField({
    super.key,
    required this.placeholder,
    required this.onSubmitted,
  });

  final String placeholder;
  final ValueChanged<String> onSubmitted;

  @override
  Widget build(BuildContext context) {
    if (context.isCupertino) {
      return CupertinoSearchTextField(
        placeholder: placeholder,
        onSubmitted: onSubmitted,
        borderRadius: BorderRadius.circular(14),
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
      );
    }
    return SearchBar(
      hintText: placeholder,
      leading: const Icon(Icons.search),
      elevation: const WidgetStatePropertyAll(0),
      onSubmitted: onSubmitted,
    );
  }
}

class AppDialogAction<T> {
  const AppDialogAction({
    required this.label,
    required this.value,
    this.isPrimary = false,
    this.isDestructive = false,
  });

  final String label;
  final T value;
  final bool isPrimary;
  final bool isDestructive;
}

/// Shows a platform-appropriate alert dialog and returns the chosen value.
Future<T?> showAppDialog<T>(
  BuildContext context, {
  required String title,
  String? message,
  Widget? content,
  required List<AppDialogAction<T>> actions,
  bool barrierDismissible = true,
}) {
  final body = content ?? (message == null ? null : Text(message));
  if (context.isCupertino) {
    return showCupertinoDialog<T>(
      context: context,
      barrierDismissible: barrierDismissible,
      builder: (ctx) => CupertinoAlertDialog(
        title: Text(title),
        content: body,
        actions: [
          for (final a in actions)
            CupertinoDialogAction(
              isDefaultAction: a.isPrimary,
              isDestructiveAction: a.isDestructive,
              onPressed: () => Navigator.of(ctx).pop(a.value),
              child: Text(a.label),
            ),
        ],
      ),
    );
  }
  return showDialog<T>(
    context: context,
    barrierDismissible: barrierDismissible,
    builder: (ctx) => AlertDialog(
      title: Text(title),
      content: body,
      actions: [
        for (final a in actions)
          a.isPrimary
              ? FilledButton(
                  onPressed: () => Navigator.of(ctx).pop(a.value),
                  child: Text(a.label),
                )
              : TextButton(
                  onPressed: () => Navigator.of(ctx).pop(a.value),
                  child: Text(a.label),
                ),
      ],
    ),
  );
}

/// Brief, non-blocking message.
void showAppToast(BuildContext context, String message) {
  final messenger = ScaffoldMessenger.maybeOf(context);
  final wide = context.windowWidth >= AppBreakpoints.medium;
  messenger
    ?..hideCurrentSnackBar()
    ..showSnackBar(
      SnackBar(
        content: Text(message),
        duration: const Duration(seconds: 2),
        width: wide ? 440 : null,
      ),
    );
}

/// Platform-appropriate loading indicator.
class AppProgress extends StatelessWidget {
  const AppProgress({super.key});

  @override
  Widget build(BuildContext context) => context.isCupertino
      ? const CupertinoActivityIndicator()
      : const CircularProgressIndicator();
}

/// A titled group of [AppTile]s: an inset glass panel on the iOS look,
/// connected rounded items (Android 16 settings style) on Material.
class AppSection extends StatelessWidget {
  const AppSection({
    super.key,
    this.header,
    this.headerLeading,
    this.footer,
    required this.children,
  });

  final String? header;
  final Widget? headerLeading;
  final String? footer;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final cupertino = context.isCupertino;
    final theme = Theme.of(context);
    final secondary = cupertino
        ? CupertinoColors.secondaryLabel.resolveFrom(context)
        : theme.colorScheme.onSurfaceVariant;
    final Widget items;
    if (cupertino) {
      final separator = CupertinoColors.separator.resolveFrom(context);
      items = GlassPanel(
        child: Column(
          children: [
            for (var i = 0; i < children.length; i++) ...[
              if (i > 0)
                Container(
                  height: 0.5,
                  margin: EdgeInsets.only(
                    left:
                        children[i] is AppTile &&
                            (children[i] as AppTile).leading != null
                        ? 60
                        : 16,
                  ),
                  color: separator,
                ),
              children[i],
            ],
          ],
        ),
      );
    } else {
      const big = Radius.circular(24);
      const small = Radius.circular(6);
      items = Column(
        children: [
          for (var i = 0; i < children.length; i++)
            Padding(
              padding: EdgeInsets.only(top: i == 0 ? 0 : 2),
              child: Material(
                color: theme.colorScheme.surfaceBright,
                clipBehavior: Clip.antiAlias,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.vertical(
                    top: i == 0 ? big : small,
                    bottom: i == children.length - 1 ? big : small,
                  ),
                ),
                child: children[i],
              ),
            ),
        ],
      );
    }
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (header != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
              child: Row(
                children: [
                  if (headerLeading != null) ...[
                    headerLeading!,
                    const SizedBox(width: 8),
                  ],
                  Expanded(
                    child: Text(
                      header!,
                      style: cupertino
                          ? TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: secondary,
                            )
                          : theme.textTheme.titleSmall?.copyWith(
                              color: theme.colorScheme.primary,
                              fontWeight: FontWeight.w600,
                            ),
                    ),
                  ),
                ],
              ),
            ),
          items,
          if (footer != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
              child: Text(
                footer!,
                style: TextStyle(fontSize: 13, color: secondary),
              ),
            ),
        ],
      ),
    );
  }
}

/// One row of an [AppSection].
class AppTile extends StatelessWidget {
  const AppTile({
    super.key,
    required this.title,
    this.subtitle,
    this.leading,
    this.trailing,
    this.onTap,
    this.enabled = true,
    this.showChevron,
    this.highlighted = false,
  });

  final String title;
  final String? subtitle;
  final Widget? leading;
  final Widget? trailing;
  final VoidCallback? onTap;

  /// Greyed out (a feature that needs something first).
  final bool enabled;

  /// Defaults to showing a chevron when the tile is tappable.
  final bool? showChevron;

  /// Marks the viewer's own row (e.g. in a leaderboard).
  final bool highlighted;

  @override
  Widget build(BuildContext context) {
    final tap = enabled ? onTap : null;
    final chevron = showChevron ?? (tap != null && trailing == null);
    if (context.isCupertino) {
      return _CupertinoTile(tile: this, onTap: tap, chevron: chevron);
    }
    final theme = Theme.of(context);
    return ListTile(
      enabled: enabled,
      tileColor: highlighted
          ? theme.colorScheme.primaryContainer.withValues(alpha: 0.5)
          : null,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      minVerticalPadding: 12,
      leading: leading,
      title: Text(title, overflow: TextOverflow.ellipsis, maxLines: 2),
      subtitle: subtitle == null ? null : Text(subtitle!),
      trailing: trailing ?? (chevron ? const Icon(Icons.chevron_right) : null),
      onTap: tap,
    );
  }
}

class _CupertinoTile extends StatefulWidget {
  const _CupertinoTile({
    required this.tile,
    required this.onTap,
    required this.chevron,
  });

  final AppTile tile;
  final VoidCallback? onTap;
  final bool chevron;

  @override
  State<_CupertinoTile> createState() => _CupertinoTileState();
}

class _CupertinoTileState extends State<_CupertinoTile> {
  bool _pressed = false;

  void _press(bool value) {
    if (widget.onTap != null && _pressed != value) {
      setState(() => _pressed = value);
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = widget.tile;
    final label = CupertinoColors.label.resolveFrom(context);
    final secondary = CupertinoColors.secondaryLabel.resolveFrom(context);
    final row = Row(
      children: [
        if (t.leading != null) ...[t.leading!, const SizedBox(width: 14)],
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                t.title,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 17,
                  letterSpacing: -0.4,
                  color: label,
                ),
              ),
              if (t.subtitle != null)
                Padding(
                  padding: const EdgeInsets.only(top: 2),
                  child: Text(
                    t.subtitle!,
                    style: TextStyle(
                      fontSize: 14,
                      letterSpacing: -0.2,
                      color: secondary,
                    ),
                  ),
                ),
            ],
          ),
        ),
        if (t.trailing != null) ...[const SizedBox(width: 8), t.trailing!],
        if (widget.chevron) ...[
          const SizedBox(width: 8),
          Icon(
            CupertinoIcons.chevron_forward,
            size: 17,
            color: CupertinoColors.tertiaryLabel.resolveFrom(context),
          ),
        ],
      ],
    );
    final Color? fill = _pressed
        ? CupertinoColors.systemFill.resolveFrom(context)
        : t.highlighted
        ? CupertinoTheme.of(context).primaryColor.withValues(alpha: 0.1)
        : null;
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTapDown: (_) => _press(true),
      onTapUp: (_) => _press(false),
      onTapCancel: () => _press(false),
      onTap: widget.onTap,
      child: Container(
        color: fill,
        constraints: const BoxConstraints(minHeight: 52),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 11),
        alignment: Alignment.centerLeft,
        child: Opacity(opacity: t.enabled ? 1 : 0.45, child: row),
      ),
    );
  }
}

/// Colored icon at the start of an [AppTile]: an iOS-settings square on the
/// iOS look, a tonal rounded container on Material.
class AppTileIcon extends StatelessWidget {
  const AppTileIcon(this.icon, {super.key, required this.color});

  final AppIcon icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    if (context.isCupertino) {
      return Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(9),
        ),
        child: Icon(icon.cupertino, color: Colors.white, size: 19),
      );
    }
    return Container(
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.16),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Icon(icon.material, color: color, size: 24),
    );
  }
}

/// Surface for standalone content: glass on the iOS look, a card on
/// Material. [color] gives a solid branded card instead.
class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
    this.color,
    this.padding = const EdgeInsets.all(16),
    this.onTap,
  });

  final Widget child;
  final Color? color;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    if (context.isCupertino) {
      final panel = GlassPanel(tint: color, padding: padding, child: child);
      return onTap == null
          ? panel
          : GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: onTap,
              child: panel,
            );
    }
    return Card(
      margin: EdgeInsets.zero,
      color: color,
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(padding: padding, child: child),
      ),
    );
  }
}

/// Choice between a few options.
class AppSegmented<T extends Object> extends StatelessWidget {
  const AppSegmented({
    super.key,
    required this.segments,
    required this.value,
    required this.onChanged,
  });

  final Map<T, String> segments;
  final T value;
  final ValueChanged<T> onChanged;

  @override
  Widget build(BuildContext context) {
    if (context.isCupertino) {
      return SizedBox(
        width: double.infinity,
        child: CupertinoSlidingSegmentedControl<T>(
          groupValue: value,
          children: {
            for (final e in segments.entries)
              e.key: Padding(
                padding: const EdgeInsets.symmetric(vertical: 6),
                child: Text(e.value),
              ),
          },
          onValueChanged: (v) {
            if (v != null) onChanged(v);
          },
        ),
      );
    }
    return SegmentedButton<T>(
      expandedInsets: EdgeInsets.zero,
      showSelectedIcon: false,
      segments: [
        for (final e in segments.entries)
          ButtonSegment(value: e.key, label: Text(e.value)),
      ],
      selected: {value},
      onSelectionChanged: (s) => onChanged(s.first),
    );
  }
}

/// On/off filter.
class AppToggleChip extends StatelessWidget {
  const AppToggleChip({
    super.key,
    required this.label,
    required this.selected,
    required this.onChanged,
  });

  final String label;
  final bool selected;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    if (!context.isCupertino) {
      return FilterChip(
        label: Text(label),
        selected: selected,
        onSelected: onChanged,
      );
    }
    final primary = CupertinoTheme.of(context).primaryColor;
    return GestureDetector(
      onTap: () => onChanged(!selected),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: selected
              ? primary.withValues(alpha: 0.14)
              : CupertinoColors.tertiarySystemFill.resolveFrom(context),
          borderRadius: BorderRadius.circular(999),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (selected) ...[
              Icon(CupertinoIcons.checkmark, size: 14, color: primary),
              const SizedBox(width: 6),
            ],
            Flexible(
              child: Text(
                label,
                style: TextStyle(
                  fontSize: 14,
                  color: selected
                      ? primary
                      : CupertinoColors.label.resolveFrom(context),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// On/off switch in the platform's style.
class AppSwitch extends StatelessWidget {
  const AppSwitch({super.key, required this.value, required this.onChanged});

  final bool value;
  final ValueChanged<bool>? onChanged;

  @override
  Widget build(BuildContext context) => context.isCupertino
      ? CupertinoSwitch(
          value: value,
          activeTrackColor: CupertinoTheme.of(context).primaryColor,
          onChanged: onChanged,
        )
      : Switch(value: value, onChanged: onChanged);
}
