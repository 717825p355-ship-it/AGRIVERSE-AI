import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class AttachmentMenu extends StatelessWidget {
  final VoidCallback onGalleryTap;
  final VoidCallback onCameraTap;
  final VoidCallback onPdfTap;

  const AttachmentMenu({
    super.key,
    required this.onGalleryTap,
    required this.onCameraTap,
    required this.onPdfTap,
  });

  Widget _attachmentBtn(
    BuildContext context, {
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(15),
      child: Container(
        width: 80,
        padding: const EdgeInsets.symmetric(vertical: 12),
        child: Column(
          children: [
            CircleAvatar(
              backgroundColor: color.withOpacity(0.1),
              radius: 24,
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 8),
            Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            "Upload File / Attachment",
            style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _attachmentBtn(
                context,
                icon: LucideIcons.image,
                label: "Gallery",
                color: Colors.emerald,
                onTap: onGalleryTap,
              ),
              _attachmentBtn(
                context,
                icon: LucideIcons.camera,
                label: "Camera",
                color: Colors.blue,
                onTap: onCameraTap,
              ),
              _attachmentBtn(
                context,
                icon: LucideIcons.fileText,
                label: "PDF",
                color: Colors.red,
                onTap: onPdfTap,
              ),
            ],
          ),
          const SizedBox(height: 10),
        ],
      ),
    );
  }
}
