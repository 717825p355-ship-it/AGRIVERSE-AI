import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'theme/app_theme.dart';
import 'screens/chat_screen.dart';

class AgriGPTApp extends ConsumerWidget {
  const AgriGPTApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);

    return MaterialApp(
      title: 'AgriGPT',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
      home: const ChatScreen(),
    );
  }
}

// Global provider managing app light/dark state
final themeModeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.light);
