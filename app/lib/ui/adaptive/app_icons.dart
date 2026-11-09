import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'platform_style.dart';

/// Icons that exist in both styles: Material Symbols on Android, SF-like
/// Cupertino icons on the PWA.
enum AppIcon {
  scoreboard(Icons.scoreboard, CupertinoIcons.square_grid_2x2_fill),
  history(Icons.history, CupertinoIcons.clock_fill),
  groups(Icons.groups, CupertinoIcons.person_3_fill),
  leaderboard(Icons.leaderboard, CupertinoIcons.chart_bar_alt_fill),
  cards(Icons.style, CupertinoIcons.suit_spade_fill),
  logout(Icons.logout, CupertinoIcons.square_arrow_right),
  edit(Icons.edit, CupertinoIcons.pencil),
  online(Icons.wifi_tethering, CupertinoIcons.antenna_radiowaves_left_right),
  bluetooth(Icons.bluetooth, CupertinoIcons.bluetooth),
  phone(Icons.phone_android, CupertinoIcons.device_phone_portrait),
  login(Icons.login, CupertinoIcons.arrow_right_to_line),
  add(Icons.add, CupertinoIcons.add),
  copy(Icons.copy, CupertinoIcons.doc_on_doc),
  close(Icons.close, CupertinoIcons.xmark),
  undo(Icons.undo, CupertinoIcons.arrow_uturn_left),
  flip(Icons.screen_rotation_alt, CupertinoIcons.arrow_2_circlepath),
  key(Icons.vpn_key_outlined, CupertinoIcons.number),
  search(Icons.search, CupertinoIcons.search),
  person(Icons.person, CupertinoIcons.person_fill),
  personOutline(Icons.person_outline, CupertinoIcons.person),
  people(Icons.people, CupertinoIcons.person_2_fill),
  personAdd(Icons.person_add_alt, CupertinoIcons.person_add),
  personRemove(Icons.person_remove_outlined, CupertinoIcons.person_badge_minus),
  groupAdd(Icons.group_add, CupertinoIcons.person_crop_circle_badge_plus),
  info(Icons.info_outline, CupertinoIcons.info_circle),
  play(Icons.play_arrow, CupertinoIcons.play_fill),
  download(Icons.download, CupertinoIcons.cloud_download),
  android(Icons.android, CupertinoIcons.device_phone_portrait),
  seat(Icons.event_seat_outlined, CupertinoIcons.circle),
  check(Icons.check_circle, CupertinoIcons.checkmark_circle_fill),
  waiting(Icons.hourglass_empty, CupertinoIcons.hourglass),
  trophy(Icons.emoji_events, CupertinoIcons.rosette),
  chevron(Icons.chevron_right, CupertinoIcons.chevron_forward);

  const AppIcon(this.material, this.cupertino);

  final IconData material;
  final IconData cupertino;
}

extension AppIconContext on BuildContext {
  IconData icon(AppIcon icon) => isCupertino ? icon.cupertino : icon.material;
}
