package app.mytrophies.truco

import android.Manifest
import android.app.Activity
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.android.gms.nearby.Nearby
import com.google.android.gms.nearby.connection.AdvertisingOptions
import com.google.android.gms.nearby.connection.ConnectionInfo
import com.google.android.gms.nearby.connection.ConnectionLifecycleCallback
import com.google.android.gms.nearby.connection.ConnectionResolution
import com.google.android.gms.nearby.connection.DiscoveredEndpointInfo
import com.google.android.gms.nearby.connection.DiscoveryOptions
import com.google.android.gms.nearby.connection.EndpointDiscoveryCallback
import com.google.android.gms.nearby.connection.Payload
import com.google.android.gms.nearby.connection.PayloadCallback
import com.google.android.gms.nearby.connection.PayloadTransferUpdate
import com.google.android.gms.nearby.connection.Strategy
import io.flutter.plugin.common.BinaryMessenger
import io.flutter.plugin.common.EventChannel
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel

/**
 * Thin bridge from Dart to Google Nearby Connections (P2P_STAR: one host,
 * several players). Connections are accepted automatically on both sides;
 * the room logic and message relaying live in Dart.
 */
class NearbyBridge(private val activity: Activity, messenger: BinaryMessenger) :
    MethodChannel.MethodCallHandler, EventChannel.StreamHandler {

    companion object {
        private const val SERVICE_ID = "app.mytrophies.truco.scorekeeper"
        private const val PERMISSION_REQUEST = 4711
    }

    private val client = Nearby.getConnectionsClient(activity)
    private val strategy = Strategy.P2P_STAR
    private var events: EventChannel.EventSink? = null
    private var pendingPermission: MethodChannel.Result? = null
    private var localName = ""

    init {
        MethodChannel(messenger, "truco/nearby").setMethodCallHandler(this)
        EventChannel(messenger, "truco/nearby/events").setStreamHandler(this)
    }

    // ------------------------------------------------------------ permissions

    private fun requiredPermissions(): Array<String> {
        val list = mutableListOf(Manifest.permission.ACCESS_FINE_LOCATION)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            list += Manifest.permission.BLUETOOTH_SCAN
            list += Manifest.permission.BLUETOOTH_ADVERTISE
            list += Manifest.permission.BLUETOOTH_CONNECT
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            list += Manifest.permission.NEARBY_WIFI_DEVICES
        }
        return list.toTypedArray()
    }

    private fun missingPermissions() = requiredPermissions().filter {
        ContextCompat.checkSelfPermission(activity, it) != PackageManager.PERMISSION_GRANTED
    }

    fun onPermissionsResult(requestCode: Int, grantResults: IntArray) {
        if (requestCode != PERMISSION_REQUEST) return
        val result = pendingPermission ?: return
        pendingPermission = null
        result.success(missingPermissions().isEmpty())
    }

    // ------------------------------------------------------------- callbacks

    private fun emit(vararg pairs: Pair<String, Any?>) {
        events?.success(mapOf(*pairs))
    }

    private val payloadCallback = object : PayloadCallback() {
        override fun onPayloadReceived(endpointId: String, payload: Payload) {
            val bytes = payload.asBytes() ?: return
            emit("type" to "payload", "endpointId" to endpointId, "data" to String(bytes, Charsets.UTF_8))
        }

        override fun onPayloadTransferUpdate(endpointId: String, update: PayloadTransferUpdate) {}
    }

    private val lifecycle = object : ConnectionLifecycleCallback() {
        override fun onConnectionInitiated(endpointId: String, info: ConnectionInfo) {
            client.acceptConnection(endpointId, payloadCallback)
            emit("type" to "initiated", "endpointId" to endpointId, "name" to info.endpointName)
        }

        override fun onConnectionResult(endpointId: String, resolution: ConnectionResolution) {
            emit(
                "type" to if (resolution.status.isSuccess) "connected" else "rejected",
                "endpointId" to endpointId,
            )
        }

        override fun onDisconnected(endpointId: String) {
            emit("type" to "disconnected", "endpointId" to endpointId)
        }
    }

    private val discovery = object : EndpointDiscoveryCallback() {
        override fun onEndpointFound(endpointId: String, info: DiscoveredEndpointInfo) {
            emit("type" to "found", "endpointId" to endpointId, "name" to info.endpointName)
        }

        override fun onEndpointLost(endpointId: String) {
            emit("type" to "lost", "endpointId" to endpointId)
        }
    }

    fun stopAll() {
        client.stopAdvertising()
        client.stopDiscovery()
        client.stopAllEndpoints()
    }

    // --------------------------------------------------------------- methods

    override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
        when (call.method) {
            "ensurePermissions" -> {
                val missing = missingPermissions()
                if (missing.isEmpty()) {
                    result.success(true)
                } else {
                    pendingPermission?.success(false)
                    pendingPermission = result
                    ActivityCompat.requestPermissions(activity, missing.toTypedArray(), PERMISSION_REQUEST)
                }
            }
            "startAdvertising" -> {
                localName = call.argument<String>("name") ?: ""
                client.startAdvertising(
                    localName, SERVICE_ID, lifecycle,
                    AdvertisingOptions.Builder().setStrategy(strategy).build(),
                ).addOnSuccessListener { result.success(null) }
                    .addOnFailureListener { result.error("advertise", it.message, null) }
            }
            "stopAdvertising" -> {
                client.stopAdvertising()
                result.success(null)
            }
            "startDiscovery" -> {
                client.startDiscovery(
                    SERVICE_ID, discovery,
                    DiscoveryOptions.Builder().setStrategy(strategy).build(),
                ).addOnSuccessListener { result.success(null) }
                    .addOnFailureListener { result.error("discover", it.message, null) }
            }
            "stopDiscovery" -> {
                client.stopDiscovery()
                result.success(null)
            }
            "connect" -> {
                val endpointId = call.argument<String>("endpointId")!!
                val name = call.argument<String>("name") ?: localName
                client.requestConnection(name, endpointId, lifecycle)
                    .addOnSuccessListener { result.success(null) }
                    .addOnFailureListener { result.error("connect", it.message, null) }
            }
            "send" -> {
                val ids = call.argument<List<String>>("endpointIds")!!
                val data = call.argument<String>("data")!!
                if (ids.isEmpty()) {
                    result.success(null)
                } else {
                    client.sendPayload(ids, Payload.fromBytes(data.toByteArray(Charsets.UTF_8)))
                        .addOnSuccessListener { result.success(null) }
                        .addOnFailureListener { result.error("send", it.message, null) }
                }
            }
            "disconnect" -> {
                client.disconnectFromEndpoint(call.argument<String>("endpointId")!!)
                result.success(null)
            }
            "stopAll" -> {
                stopAll()
                result.success(null)
            }
            else -> result.notImplemented()
        }
    }

    override fun onListen(arguments: Any?, sink: EventChannel.EventSink?) {
        events = sink
    }

    override fun onCancel(arguments: Any?) {
        events = null
    }
}
