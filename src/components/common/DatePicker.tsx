import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '@/theme/tokens';
import { format, parseISO, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay } from 'date-fns';

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label }) => {
  const [visible, setVisible] = useState(false);
  const [viewDate, setViewDate] = useState(value ? parseISO(value) : new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(viewDate);
  const firstDayOfWeek = getDay(startOfMonth(viewDate));
  const days: (number | null)[] = [];

  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const selectedDate = value ? parseISO(value) : null;
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const handleSelect = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(dateStr);
    setVisible(false);
  };

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.trigger} onPress={() => setVisible(true)}>
        <Text style={[styles.triggerText, !value && styles.placeholder]}>
          {value ? format(parseISO(value), 'yyyy년 MM월 dd일') : '날짜를 선택해주세요'}
        </Text>
        <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.calendar}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setViewDate(subMonths(viewDate, 1))} style={styles.navBtn}>
                <Ionicons name="chevron-back" size={20} color={colors.primary} />
              </TouchableOpacity>
              <Text style={styles.monthYear}>{year}년 {month + 1}월</Text>
              <TouchableOpacity onPress={() => setViewDate(addMonths(viewDate, 1))} style={styles.navBtn}>
                <Ionicons name="chevron-forward" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.weekRow}>
              {weekDays.map((d) => (
                <Text key={d} style={styles.weekDay}>{d}</Text>
              ))}
            </View>
            <View style={styles.daysGrid}>
              {days.map((day, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.dayCell,
                    day && selectedDate && selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day
                      ? styles.selectedDay
                      : null,
                  ]}
                  onPress={() => day && handleSelect(day)}
                  disabled={!day}
                >
                  <Text
                    style={[
                      styles.dayText,
                      day && selectedDate && selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day
                        ? styles.selectedDayText
                        : null,
                    ]}
                  >
                    {day ?? ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  triggerText: {
    ...typography.body,
    color: colors.text,
  },
  placeholder: {
    color: colors.textTertiary,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  calendar: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: 320,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  navBtn: {
    padding: spacing.sm,
  },
  monthYear: {
    ...typography.subtitle,
    color: colors.text,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    ...typography.captionBold,
    color: colors.textTertiary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    ...typography.body,
    color: colors.text,
  },
  selectedDay: {
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
  selectedDayText: {
    color: colors.white,
    fontWeight: '700',
  },
});
