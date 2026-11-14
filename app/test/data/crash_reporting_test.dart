import 'package:flutter_test/flutter_test.dart';
import 'package:truco/data/crash_reporting.dart';

void main() {
  test('offline errors are not crashes', () {
    expect(
      CrashReporting.isOfflineError(
        Exception(
          'AuthRetryableFetchException(message: ClientException with '
          "SocketException: Failed host lookup: 'x.supabase.co')",
        ),
      ),
      isTrue,
    );
    expect(CrashReporting.isOfflineError(StateError('bad state')), isFalse);
  });
}
