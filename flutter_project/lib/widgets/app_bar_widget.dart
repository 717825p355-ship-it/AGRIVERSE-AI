import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../utils/constants.dart';

class AppBarWidget extends StatelessWidget implements PreferredSizeWidget {
  final VoidCallback onNewChat;
  final VoidCallback onHistoryPressed;
  final VoidCallback onThemeToggle;
  final ThemeMode currentThemeMode;
  final bool showHistoryIcon;

  const AppBarWidget({
    super.key,
    required this.onNewChat,
    required this.onHistoryPressed,
    required this.onThemeToggle,
    required this.currentThemeMode,
    this.showHistoryIcon = true,
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            AppConstants.appName,
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
          ),
          Text(
            AppConstants.appSubtitle,
            style: TextStyle(
              fontSize: 12,
              color: Theme.of(context).brightness == Brightness.dark
                  ? Colors.white70
                  : Colors.black54,
            ),
          ),
        ],
      ),
      actions: [
        IconButton(
          icon: const Icon(LucideIcons.plusCircle),
          tooltip: "New Chat",
          onPressed: onNewChat,
        ),
        if (showHistoryIcon)
          IconButton(
            icon: const Icon(LucideIcons.history),
            tooltip: "Chat History",
            onPressed: onHistoryPressed,
          ),
        IconButton(
          icon: Icon(currentThemeMode == ThemeMode.light ? LucideIcons.moon : LucideIcons.sun),
          tooltip: "Toggle Light/Dark",
          onPressed: onThemeToggle,
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
