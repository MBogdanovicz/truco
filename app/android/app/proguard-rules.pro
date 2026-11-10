# Release builds are shrunk by R8. These keep what it would remove by
# mistake.

# WorkManager (brought in by the AdMob SDK) creates its Room database by
# reflection; without this the app crashes at startup.
-keep class * extends androidx.room.RoomDatabase { <init>(); }
-keep class androidx.work.impl.WorkDatabase_Impl { *; }
