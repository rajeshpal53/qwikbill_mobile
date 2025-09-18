import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent
} from 'expo-speech-recognition';
import { fontFamily } from '../../Util/UtilApi';
import { FontAwesome } from '@expo/vector-icons';
import { createApi } from '../../Util/UtilApi';
 import { useIsFocused } from '@react-navigation/native';


export default function ChatWithUs() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello, I am the bot.', fromBot: true },
  ]);
  const [input, setInput] = useState('');
  const [recognizing, setRecognizing] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
if (!isFocused) ExpoSpeechRecognitionModule.stop();
 }, [isFocused]);

  // Voice events
  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
     if (!isFocused) return;     
    const transcript = event.results[0]?.transcript;
    if (transcript) setInput(transcript);
  });
  useSpeechRecognitionEvent("error", (event) => console.error("Speech error:", event.error, event.message));

  const startVoice = async () => {
    const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!perm.granted) return;
    ExpoSpeechRecognitionModule.start({ lang: 'en-US', interimResults: false });
  };

  const stopVoice = () => {
    ExpoSpeechRecognitionModule.stop();
  };

  const callNlpApi = async (message) => {
    try {
      const res = await fetch("https://qwikbill.in/qapi/nlp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      console.log("response of bot is ", res)

      const data = await res.json();
      console.log("✅ parsed JSON:", data);
          return data;


    } catch (err) {
      console.error("NLP API error:", err);
      return null;
    }
  };




  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: Date.now().toString(), text, fromBot: false, createdAt: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const result = await callNlpApi(text);
    const replyText = result?.reply || "Sorry, I don't understand that.";

    const botMsg = { id: (Date.now() + 1).toString(), text: replyText, fromBot: true, createdAt: new Date() };
    setMessages(prev => [...prev, botMsg]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <FlatList
        data={messages}
        keyExtractor={m => m.id}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 4 }}>
            <View style={[styles.bubble, item.fromBot ? styles.botBubble : styles.userBubble]}>
              <Text style={item.fromBot ? styles.botText : styles.userText}>{item.text}</Text>
            </View>
            {/* <Text style={[styles.timeText, { alignSelf: item.fromBot ? 'flex-start' : 'flex-end' }]}>
              {item.createdAt.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
            </Text> */}
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={recognizing ? "Listening..." : "Type your message..."}
          style={styles.textInput}
        />
        <TouchableOpacity onPress={recognizing ? stopVoice : startVoice} style={styles.voiceBtn}>
          <Text style={styles.voiceBtnText}>
            {recognizing ? "Stop" : <FontAwesome name='microphone' size={22} />}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
          <Text style={styles.sendBtnText}><FontAwesome name='send' size={18} /></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bubble: { marginVertical: 4, padding: 8, maxWidth: '80%', borderRadius: 12 },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#ededed' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#26a0df' },
  botText: { color: '#000' },
  userText: { color: '#fff' },
  timeText: { fontSize: 10, color: '#666', marginTop: 2 },
  inputRow: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: '#ddd' },
  textInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 10 },
  voiceBtn: { marginLeft: 8, justifyContent: 'center', paddingHorizontal: 10 },
  voiceBtnText: { fontSize: 20 },
  sendBtn: { marginLeft: 8, paddingHorizontal: 16, justifyContent: 'center', backgroundColor: '#0c3b73', borderRadius: 20 },
  sendBtnText: { color: '#fff', fontFamily: fontFamily.medium, fontSize: 12 },
});