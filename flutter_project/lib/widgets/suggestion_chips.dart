import 'package:flutter/material.dart';
import '../utils/constants.dart';

class SuggestionChips extends StatelessWidget {
  final Function(String) onSuggestionSelected;

  const SuggestionChips({
    super.key,
    required this.onSuggestionSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 10,
      children: AppConstants.popularInquiries.map((sug) {
        return InkWell(
          onTap: () => onSuggestionSelected(sug['text']!),
          borderRadius: BorderRadius.circular(20),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: Theme.of(context).brightness == Brightness.dark
                  ? Colors.grey[900]
                  : Colors.emerald.withOpacity(0.04),
              border: Border.all(
                color: Colors.emerald.withOpacity(0.15),
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(sug['icon']!, style: const TextStyle(fontSize: 16)),
                const SizedBox(width: 8),
                Text(
                  sug['text']!,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Theme.of(context).brightness == Brightness.dark
                        ? Colors.white
                        : Colors.emerald[900],
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}
