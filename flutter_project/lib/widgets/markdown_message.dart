import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

class MarkdownMessage extends StatelessWidget {
  final String text;
  final bool isUser;
  final bool isDark;

  const MarkdownMessage({
    super.key,
    required this.text,
    required this.isUser,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return MarkdownBody(
      data: text,
      styleSheet: MarkdownStyleSheet(
        p: TextStyle(
          color: isUser ? Colors.white : (isDark ? Colors.white : Colors.black80),
          fontSize: 15,
          height: 1.5,
        ),
        listBullet: TextStyle(
          color: isUser ? Colors.white : Colors.emerald,
        ),
        tableBody: const TextStyle(fontSize: 13),
      ),
    );
  }
}
