// Browser-based Speech-to-Text and Text-to-Speech controller
// Provides robust offline support for voice input and audio guidance

export const LANGUAGE_CODES: Record<string, string> = {
  English: 'en-IN',
  Tamil: 'ta-IN',
  Hindi: 'hi-IN',
  Telugu: 'te-IN',
  Kannada: 'kn-IN',
  Malayalam: 'ml-IN',
};

// Simple voice instruction translations for Easy Mode narration
export const VOICE_INSTRUCTIONS: Record<string, Record<string, string>> = {
  English: {
    welcome: 'Welcome to Agri A I Assistant. Let me help you farm better.',
    chatbot: 'Click the big microphone button to speak, or listen to my answers.',
    easy_mode_active: 'Easy Mode is active. I will read everything out loud.',
    save_success: 'Farming guide successfully saved to offline database.',
    quiz_correct: 'Perfect! That is the right answer.',
    quiz_wrong: 'Do not worry! Try again, or read the steps to learn more.',
    emergency_help: 'Emergency alert selected. Please select a problem for instant relief tips.',
  },
  Tamil: {
    welcome: 'அக்ரி ஏ ஐ உதவி மையத்திற்கு வரவேற்கிறோம். விவசாயத்தை சிறப்பாக செய்ய நான் உதவுகிறேன்.',
    chatbot: 'பேசுவதற்கு பெரிய மைக்ரோஃபோன் பொத்தானை அழுத்தவும் அல்லது எனது பதிலைக் கேட்கவும்.',
    easy_mode_active: 'எளிதான முறை செயலில் உள்ளது. நான் எல்லாவற்றையும் உரக்கப் படிப்பேன்.',
    save_success: 'விவசாய வழிகாட்டி ஆஃப்லைனில் சேமிக்கப்பட்டது.',
    quiz_correct: 'அருமை! இது சரியான பதில்.',
    quiz_wrong: 'கவலைப்படாதீர்கள்! மீண்டும் முயற்சிக்கவும், அல்லது படிகளைப் படிக்கவும்.',
    emergency_help: 'அவசர உதவி தேவைப்படுகிறது. உடனடி நிவாரண உதவிக்கு சிக்கலைத் தேர்ந்தெடுக்கவும்.',
  },
  Hindi: {
    welcome: 'एग्री एआई असिस्टेंट में आपका स्वागत है। चलिए खेती को और बेहतर बनाते हैं।',
    chatbot: 'बोलने के लिए बड़े माइक बटन को दबाएं, या मेरी बात सुनें।',
    easy_mode_active: 'आसान मोड चालू है। मैं सब कुछ बोलकर सुनाऊंगा।',
    save_success: 'खेती की जानकारी ऑफलाइन सुरक्षित कर ली गई है।',
    quiz_correct: 'बहुत बढ़िया! यह बिल्कुल सही उत्तर है।',
    quiz_wrong: 'चिंता न करें! फिर से प्रयास करें, या सीखने के लिए चरणों को पढ़ें।',
    emergency_help: 'आपातकालीन सहायता। तत्काल सुझाव के लिए अपनी समस्या चुनें।',
  },
  Telugu: {
    welcome: 'అగ్రి ఏఐ అసిస్టెంట్ కు స్వాగతం. వ్యవసాయం బాగా చేయడానికి నేను మీకు సహాయం చేస్తాను.',
    chatbot: 'మాట్లాడటానికి పెద్ద మైక్రోఫోన్ బటన్ క్లిక్ చేయండి, లేదా నా సమాధానం వినండి.',
    easy_mode_active: 'సులభమైన మోడ్ ఆన్‌లో ఉంది. నేను ప్రతిదీ గట్టిగా చదువుతాను.',
    save_success: 'వ్యవసాయ గైడ్ విజయవంతంగా సేవ్ చేయబడింది.',
    quiz_correct: 'చాలా బాగుంది! ఇది సరైన సమాధానం.',
    quiz_wrong: 'చింతించకండి! మళ్ళీ ప్రయత్నించండి, లేదా వివరాలు చదవండి.',
    emergency_help: 'అత్యవసర సహాయం. తక్షణ ఉపశమనం కోసం సమస్యను ఎంచుకోండి.',
  },
  Kannada: {
    welcome: 'ಅಗ್ರಿ ಎಐ ಸಹಾಯಕ್ಕೆ ಸುಸ್ವಾಗತ. ವ್ಯವಸಾಯವನ್ನು ಉತ್ತಮವಾಗಿ ಮಾಡಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.',
    chatbot: 'ಮಾತನಾಡಲು ದೊಡ್ಡ ಮೈಕ್ರೊಫೋನ್ ಬಟನ್ ಒತ್ತಿ, ಅಥವಾ ನನ್ನ ಉತ್ತರವನ್ನು ಕೇಳಿ.',
    easy_mode_active: 'ಸುಲಭ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ. ನಾನು ಎಲ್ಲವನ್ನೂ ಜೋರಾಗಿ ಓದುತ್ತೇನೆ.',
    save_success: 'ಕೃಷಿ ಮಾರ್ಗದರ್ಶಿ ಯಶಸ್ವಿಯಾಗಿ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ.',
    quiz_correct: 'ಉತ್ತಮ! ಇದು ಸರಿಯಾದ ಉತ್ತರ.',
    quiz_wrong: 'ಚಿಂತಿಸಬೇಡಿ! ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ, ಅಥವಾ ಕಲಿಯಲು ಹಂತಗಳನ್ನು ಓದಿ.',
    emergency_help: 'ತುರ್ತು ಸಹಾಯ. ತಕ್ಷಣದ ಪರಿಹಾರಕ್ಕಾಗಿ ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಆರಿಸಿ.',
  },
  Malayalam: {
    welcome: 'അഗ്രി എ ഐ അസിസ്റ്റന്റിലേക്ക് സ്വാഗതം. കൃഷി കൂടുതൽ മെച്ചപ്പെടുത്താൻ ഞാൻ സഹായിക്കാം.',
    chatbot: 'സംസാരിക്കാൻ വലിയ മൈക്രോഫോൺ ബട്ടൺ അമർത്തുക, അല്ലെങ്കിൽ എന്റെ മറുപടി കേൾക്കുക.',
    easy_mode_active: 'ലളിതമായ മോഡ് സജീവമാണ്. ഞാൻ എല്ലാം ഉറക്കെ വായിക്കും.',
    save_success: 'കൃഷി ഗൈഡ് വിജയകരമായി ഓഫ്ലൈനിൽ സൂക്ഷിച്ചു.',
    quiz_correct: 'വളരെ നന്നായിരിക്കുന്നു! ഇത് ശരിയായ ഉത്തരമാണ്.',
    quiz_wrong: 'വിഷമിക്കേണ്ട! വീണ്ടും ശ്രമിക്കുക, അല്ലെങ്കിൽ കൂടുതൽ അറിയാൻ വായിക്കുക.',
    emergency_help: 'അടിയന്തിര സഹായം. പരിഹാരങ്ങൾക്കായി പ്രശ്നം തിരഞ്ഞെടുക്കുക.',
  }
};

class VoiceController {
  private synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  public speak(text: string, language: string = 'English'): void {
    if (!this.synth) return;

    this.stop();

    const langCode = LANGUAGE_CODES[language] || 'en-IN';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.95; // Slightly slower for rural/elderly accessibility
    utterance.pitch = 1.0;

    // Try to select a native voice matching the language code if possible
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(langCode) || v.lang.includes(langCode.replace('-', '_')));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public speakInstruction(key: string, language: string = 'English'): void {
    const translationSet = VOICE_INSTRUCTIONS[language] || VOICE_INSTRUCTIONS.English;
    const text = translationSet[key] || VOICE_INSTRUCTIONS.English[key] || '';
    if (text) {
      this.speak(text, language);
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Check speech recognition capabilities
  public getSpeechRecognition(onResult: (text: string) => void, onEnd: () => void, onError: (err: string) => void) {
    if (typeof window === 'undefined') return null;

    const SpeechRecognitionAPI = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      return null;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const result = event.results[0]?.[0]?.transcript || '';
      onResult(result);
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event);
      onError(event.error || 'Speech error');
    };

    return recognition;
  }
}

export const voiceController = new VoiceController();
export default voiceController;
