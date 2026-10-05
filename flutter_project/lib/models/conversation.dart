class ConversationModel {
  final String id;
  final String title;
  final DateTime date;
  final String preview;

  ConversationModel({
    required this.id,
    required this.title,
    required this.date,
    required this.preview,
  });

  ConversationModel copyWith({
    String? id,
    String? title,
    DateTime? date,
    String? preview,
  }) {
    return ConversationModel(
      id: id ?? this.id,
      title: title ?? this.title,
      date: date ?? this.date,
      preview: preview ?? this.preview,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'date': date.toIso8601String(),
    'preview': preview,
  };

  factory ConversationModel.fromJson(Map<String, dynamic> json) => ConversationModel(
    id: json['id'] as String,
    title: json['title'] as String,
    date: DateTime.parse(json['date'] as String),
    preview: json['preview'] as String,
  );
}
