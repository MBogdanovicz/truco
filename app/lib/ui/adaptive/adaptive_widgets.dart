import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'platform_style.dart';

/// Page scaffold with a platform-appropriate navigation bar.
class AppScaffold extends StatelessWidget {
  const AppScaffold({
    super.key,
    required this.title,
    required this.body,
    this.actions = const [],
    this.backgroundColor,
    this.barColor,
  });

  final String title;
  final Widget body;
  final List<Widget> actions;
  final Color? backgroundColor;

  /// Dark navigation bar color; its title and icons become white.
  final Color? barColor;

  @override
  Widget build(BuildContext context) {
    if (context.isCupertino) {
      final onBar = barColor == null ? null : Colors.white;
      final scaffold = CupertinoPageScaffold(
        backgroundColor: backgroundColor,
        navigationBar: CupertinoNavigationBar(
          backgroundColor: barColor,
          leading: onBar != null && Navigator.of(context).canPop()
              ? CupertinoNavigationBarBackButton(color: onBar)
              : null,
          middle: Text(
            title,
            style: onBar == null ? null : TextStyle(color: onBar),
          ),
          trailing: actions.isEmpty
              ? null
              : IconTheme.merge(
                  data: IconThemeData(color: onBar),
                  child: Row(mainAxisSize: MainAxisSize.min, children: actions),
                ),
        ),
        // Material ancestor so shared Material widgets (InkWell, Text styles)
        // keep working inside Cupertino pages.
        child: Material(
          type: MaterialType.transparency,
          child: SafeArea(child: body),
        ),
      );
      if (onBar == null) return scaffold;
      return CupertinoTheme(
        data: CupertinoTheme.of(context).copyWith(primaryColor: onBar),
        child: scaffold,
      );
    }
    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        title: Text(title),
        actions: actions,
        backgroundColor: barColor,
        foregroundColor: barColor == null ? null : Colors.white,
      ),
      body: SafeArea(child: body),
    );
  }
}

/// Primary call-to-action button.
class AppButton extends StatelessWidget {
  const AppButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    final child = icon == null
        ? Text(label)
        : Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 20),
              const SizedBox(width: 8),
              Flexible(child: Text(label, overflow: TextOverflow.ellipsis)),
            ],
          );
    if (context.isCupertino) {
      return CupertinoButton.filled(onPressed: onPressed, child: child);
    }
    return FilledButton(onPressed: onPressed, child: child);
  }
}

/// Secondary, low-emphasis button.
class AppTextButton extends StatelessWidget {
  const AppTextButton({
    super.key,
    required this.label,
    required this.onPressed,
  });

  final String label;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    if (context.isCupertino) {
      return CupertinoButton(onPressed: onPressed, child: Text(label));
    }
    return TextButton(onPressed: onPressed, child: Text(label));
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
        padding: const EdgeInsets.all(14),
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
  messenger
    ?..hideCurrentSnackBar()
    ..showSnackBar(
      SnackBar(content: Text(message), duration: const Duration(seconds: 2)),
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
