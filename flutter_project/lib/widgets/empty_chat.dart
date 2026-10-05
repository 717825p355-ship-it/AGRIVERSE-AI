import 'package:flutter/material.dart';
import 'suggestion_chips.dart';

class EmptyChat extends StatelessWidget {
  final Function(String) onSuggestionSelected;

  const EmptyChat({
    super.key,
    required this.onSuggestionSelected,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(height: 50),
          const CircleAvatar(
            radius: 40,
            backgroundColor: Color(0xFFE8F5E9),
            child: Text(
              "🌱",
              style: TextStyle(fontSize: 40),
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            "Welcome to AgriGPT",
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.black, tracking: -0.5),
          ),
          const SizedBox(height: 8),
          const Text(
            ""What would you like to know today?"",
            style: TextStyle(fontSize: 14, fontStyle: FontStyle.italic, color: Colors.grey),
          ),
          const SizedBox(height: 40),
          Align(
            alignment: Alignment.centerLeft,
            child: Text(
              "Popular Agri-Inquiries",
              style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(height: 12),
          SuggestionChips(
            onSuggestionSelected: onSuggestionSelected,
          ),
        ],
      ),
    );
  }
}
