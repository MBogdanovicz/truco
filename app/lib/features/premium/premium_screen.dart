import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:in_app_purchase/in_app_purchase.dart';

import '../../data/auth_repository.dart';
import '../../data/entitlements.dart';
import '../../data/premium_repository.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/android_download_card.dart';
import '../../ui/theme/app_theme.dart';

final _productsProvider =
    FutureProvider.autoDispose<Map<String, ProductDetails>>(
      (ref) => ref.read(premiumStoreProvider.notifier).products(),
    );

/// What premium unlocks, buying it (Android) and inviting friends.
class PremiumScreen extends ConsumerWidget {
  const PremiumScreen({super.key});

  static const _benefits = [
    (AppIcon.play, 'Sem anúncios', 'Nenhum anúncio antes das partidas.'),
    (
      AppIcon.groups,
      'Grupos sem limite',
      'Na versão grátis, até 2 grupos (criados ou como membro).',
    ),
    (
      AppIcon.palette,
      'Visuais do placar e da mesa',
      'Todos os temas do placar, da mesa e do baralho (sem o Premium, '
          'só três saem com conquistas).',
    ),
    (
      AppIcon.online,
      'Salas de jogo online',
      'Crie salas para jogar truco online. Para entrar na sala de alguém '
          'não precisa, e as salas do marcador são grátis.',
    ),
    (
      AppIcon.edit,
      'Mudar seu nome',
      'Troque o nome quando quiser (sem o Premium, uma vez).',
    ),
    (
      AppIcon.people,
      'Convide 3 amigos',
      'Quem compra pelo preço cheio manda 3 convites com desconto.',
    ),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider).value;
    final premium = ref.watch(entitlementsProvider).value?.isPremium ?? false;
    final theme = Theme.of(context);

    return AppScaffold(
      title: 'Truco Premium',
      maxWidth: 640,
      onRefresh: () async {
        ref
          ..invalidate(entitlementsProvider)
          ..invalidate(receivedInviteProvider)
          ..invalidate(myInvitesProvider)
          ..invalidate(boughtFullPriceProvider);
      },
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(4, 0, 4, 20),
          child: Text(
            premium
                ? 'Você tem o Truco Premium. Obrigado por apoiar o app!'
                : 'Uma compra só, sem assinatura. Vale para sempre, no app e '
                      'no site, entrando com o mesmo e-mail.',
            style: theme.textTheme.bodyLarge,
          ),
        ),
        if (user != null && !user.isGuest && user.email != null)
          AppSection(
            children: [
              AppTile(
                leading: AppTileIcon(
                  AppIcon.email,
                  color: premium ? AppColors.gold : AppColors.felt,
                ),
                title: user.email!,
                subtitle: premium
                    ? 'Premium ativo neste e-mail'
                    : 'A compra fica neste e-mail',
              ),
            ],
          ),
        AppSection(
          header: 'O que vem no Premium',
          children: [
            for (final (icon, title, subtitle) in _benefits)
              AppTile(
                leading: AppTileIcon(icon, color: AppColors.gold),
                title: title,
                subtitle: subtitle,
              ),
          ],
        ),
        if (user == null || user.isGuest)
          const _Note(
            'Para comprar, entre com seu e-mail: o Premium fica guardado na '
            'sua conta.',
          )
        else if (premium)
          const _Invites()
        else if (!PremiumStore.isSupported)
          Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const _Note(
                'A compra é feita no app para Android. Depois, é só entrar '
                'aqui com o mesmo e-mail que o Premium já vem liberado.',
              ),
              if (AndroidDownloadCard.isShown) const AndroidDownloadCard(),
            ],
          )
        else
          const _Buy(),
      ],
    );
  }
}

class _Note extends StatelessWidget {
  const _Note(this.text);
  final String text;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(4, 0, 4, 24),
    child: Text(text, textAlign: TextAlign.center),
  );
}

class _Buy extends ConsumerWidget {
  const _Buy();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final products = ref.watch(_productsProvider);
    final invite = ref.watch(receivedInviteProvider).value;
    final status = ref.watch(premiumStoreProvider);
    final store = ref.read(premiumStoreProvider.notifier);
    final busy =
        status == StoreStatus.buying ||
        status == StoreStatus.verifying ||
        status == StoreStatus.restoring;

    return products.when(
      loading: () => const Center(child: AppProgress()),
      error: (_, _) => const _Note(
        'Não foi possível falar com a Play Store. Tente de novo mais tarde.',
      ),
      data: (map) {
        final product =
            map[invite != null ? PremiumProducts.invite : PremiumProducts.full];
        if (product == null) {
          return const _Note(
            'A compra não está disponível agora. Ela só funciona no app '
            'instalado pela Play Store.',
          );
        }
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (invite != null)
              _Note(
                '${invite.inviterName ?? 'Um amigo'} te convidou: o Premium '
                'sai com desconto para você.',
              ),
            if (busy)
              const Center(child: AppProgress())
            else
              AppButton(
                label: 'Comprar por ${product.price}',
                onPressed: () => store.buy(product),
              ),
            if (status == StoreStatus.verifying)
              const _Note('Confirmando a compra…'),
            if (status == StoreStatus.restoring)
              const _Note('Procurando compras desta conta do Google Play…'),
            if (status == StoreStatus.failed)
              const _Note(
                'A compra não foi concluída. Se o valor foi cobrado, toque em '
                '"Restaurar compra".',
              ),
            if (status == StoreStatus.nothingToRestore)
              const _Note(
                'Nenhuma compra pendente nesta conta do Google Play. Cada '
                'compra fica no e-mail que a fez: entre com ele, ou toque em '
                'Comprar para este e-mail.',
              ),
            if (status == StoreStatus.otherAccount)
              const _Note(
                'Essa compra do Google Play já liberou o Premium para outro '
                'e-mail, que continua Premium. Para este e-mail, toque em '
                'Comprar de novo.',
              ),
            const SizedBox(height: 8),
            AppTextButton(
              label: 'Restaurar compra',
              onPressed: busy ? null : store.restore,
            ),
          ],
        );
      },
    );
  }
}

class _Invites extends ConsumerWidget {
  const _Invites();

  Future<void> _add(BuildContext context, WidgetRef ref) async {
    final email = TextEditingController();
    final ok = await showAppDialog<bool>(
      context,
      title: 'Convidar um amigo',
      content: Padding(
        padding: const EdgeInsets.only(top: 12),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Ele compra o Premium com desconto, entrando no app com este '
              'e-mail.',
            ),
            const SizedBox(height: 12),
            AppTextField(
              controller: email,
              label: 'E-mail do amigo',
              keyboardType: TextInputType.emailAddress,
              autofocus: true,
            ),
          ],
        ),
      ),
      actions: const [
        AppDialogAction(label: 'Cancelar', value: false),
        AppDialogAction(label: 'Convidar', value: true, isPrimary: true),
      ],
    );
    final value = email.text.trim();
    email.dispose();
    if (ok != true || value.isEmpty || !context.mounted) return;
    try {
      await ref.read(premiumRepositoryProvider)!.invite(value);
      ref.invalidate(myInvitesProvider);
      if (context.mounted) {
        showAppToast(context, 'Convite criado. Avise seu amigo!');
      }
    } on InviteError catch (e) {
      if (!context.mounted) return;
      showAppToast(context, switch (e.code) {
        'cannot_invite_self' => 'Esse é o seu e-mail.',
        'already_premium' => 'Essa pessoa já tem o Premium.',
        'already_invited' => 'Você já convidou esse e-mail.',
        'invite_limit_reached' => 'Você já usou os 3 convites.',
        _ => 'Só quem comprou pelo preço cheio pode convidar.',
      });
    } on Object {
      if (context.mounted) {
        showAppToast(context, 'Não foi possível criar o convite.');
      }
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final full = ref.watch(boughtFullPriceProvider).value ?? false;
    if (!full) return const SizedBox.shrink();
    final invites = ref.watch(myInvitesProvider).value ?? const [];
    final left = PremiumProducts.inviteLimit - invites.length;
    return AppSection(
      header: 'Seus convites',
      footer:
          'O convite vale para o e-mail que seu amigo usa para entrar no '
          'app. Ele vê o desconto na tela do Premium.',
      children: [
        for (final i in invites)
          AppTile(
            leading: Icon(
              context.icon(i.redeemed ? AppIcon.check : AppIcon.waiting),
              color: i.redeemed ? AppColors.felt : Colors.grey,
            ),
            title: i.email,
            subtitle: i.redeemed
                ? 'Comprou com o convite'
                : 'Ainda não comprou',
            trailing: i.redeemed
                ? null
                : IconButton(
                    tooltip: 'Cancelar convite',
                    icon: Icon(context.icon(AppIcon.close)),
                    onPressed: () async {
                      await ref
                          .read(premiumRepositoryProvider)!
                          .cancelInvite(i.id);
                      ref.invalidate(myInvitesProvider);
                    },
                  ),
          ),
        if (left > 0)
          AppTile(
            leading: AppTileIcon(AppIcon.personAdd, color: AppColors.gold),
            title: 'Convidar um amigo',
            subtitle: left == 1 ? 'Resta 1 convite' : 'Restam $left convites',
            onTap: () => _add(context, ref),
          ),
      ],
    );
  }
}

/// Tells a free user that [feature] is premium and offers to see the offer.
Future<void> showPremiumRequired(BuildContext context, String feature) async {
  final see = await showAppDialog<bool>(
    context,
    title: 'Truco Premium',
    message:
        '$feature faz parte do Truco Premium: uma compra só, sem '
        'assinatura.',
    actions: const [
      AppDialogAction(label: 'Agora não', value: false),
      AppDialogAction(label: 'Ver o Premium', value: true, isPrimary: true),
    ],
  );
  if (see == true && context.mounted) context.go('/premium');
}
