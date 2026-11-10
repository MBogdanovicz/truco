package app.mytrophies.truco

import android.os.Bundle
import com.google.android.gms.games.PlayGamesSdk
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine

class MainActivity : FlutterActivity() {
    private var nearby: NearbyBridge? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        // Google Play Games must be set up before its sign-in is used.
        PlayGamesSdk.initialize(this)
        super.onCreate(savedInstanceState)
    }

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        nearby = NearbyBridge(this, flutterEngine.dartExecutor.binaryMessenger)
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray,
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        nearby?.onPermissionsResult(requestCode, grantResults)
    }

    override fun onDestroy() {
        nearby?.stopAll()
        super.onDestroy()
    }
}
