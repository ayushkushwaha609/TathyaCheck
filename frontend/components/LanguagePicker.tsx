import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LANGUAGES, Language } from '../constants/languages';
import { useThemeStore } from '../store/useThemeStore';

interface LanguagePickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export const LanguagePicker: React.FC<LanguagePickerProps> = ({
  selectedValue,
  onValueChange,
}) => {
  const { colors } = useThemeStore();
  const [modalVisible, setModalVisible] = useState(false);
  const selectedLanguage = LANGUAGES.find((lang) => lang.value === selectedValue);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: Language }) => (
    <TouchableOpacity
      style={[
        styles.option,
        { borderBottomColor: colors.divider },
        item.value === selectedValue && { backgroundColor: colors.cardBorder },
      ]}
      onPress={() => handleSelect(item.value)}
    >
      <Text style={[styles.optionNative, { color: colors.textPrimary }]}>{item.nativeLabel}</Text>
      <Text style={[styles.optionLabel, { color: colors.textSecondary }]}>{item.label}</Text>
      {item.value === selectedValue && (
        <Ionicons name="checkmark" size={20} color={colors.saffron} />
      )}
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder }]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectorContent}>
          <Ionicons name="language" size={20} color={colors.textSecondary} />
          <Text style={[styles.selectorText, { color: colors.textPrimary }]}>
            {selectedLanguage?.nativeLabel} ({selectedLanguage?.label})
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.cardBorder }]}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Language</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={LANGUAGES}
              renderItem={renderItem}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1,
  },
  selectorContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  selectorText: { fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40, maxHeight: '60%' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  option: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1,
  },
  optionNative: { fontSize: 18, fontWeight: '500', flex: 1 },
  optionLabel: { fontSize: 14, marginRight: 12 },
});
