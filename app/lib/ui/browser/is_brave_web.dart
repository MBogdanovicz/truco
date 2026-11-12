import 'dart:js_interop';
import 'dart:js_interop_unsafe';

import 'package:web/web.dart' as web;

bool get isBrave {
  try {
    return (web.window.navigator as JSObject).has('brave');
  } on Object {
    return false;
  }
}
