import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import CheckBox from 'expo-checkbox';

export default function FormOperatingHours({ operatingHours, setOperatingHours, DAYS_OF_WEEK_CONFIG }) {
    const handleCheckBoxChange = (dayId) => {
        if (dayId === 8) {
            const newSelected = !operatingHours[8].selected;
            const updated = { ...operatingHours };

            updated[8].selected = newSelected;

            if (newSelected) {
                for (let id = 1; id <= 5; id++) {
                    updated[id].open = updated[8].open;
                    updated[id].close = updated[8].close;
                }
            }

            setOperatingHours(updated);
        } else {
            setOperatingHours(prevHours => ({
                ...prevHours,
                [dayId]: {
                    ...prevHours[dayId],
                    selected: !prevHours[dayId].selected,
                    open: !prevHours[dayId].selected ? prevHours[dayId].open : '',
                    close: !prevHours[dayId].selected ? prevHours[dayId].close : '',
                }
            }));
        }
    };

    const handleTimeChange = (dayId, timeType, value) => {
        if (dayId === 8) {
            const updated = { ...operatingHours };
            updated[8][timeType] = value;

            if (updated[8].selected) {
                for (let id = 1; id <= 5; id++) {
                    updated[id][timeType] = value;
                }
            }

            setOperatingHours(updated);
        } else {
            setOperatingHours(prevHours => ({
                ...prevHours,
                [dayId]: {
                    ...prevHours[dayId],
                    [timeType]: value,
                }
            }));
        }
    };

    const formatTime = (text) => {
        const cleaned = text.replace(/\D/g, '').slice(0, 4);

        if (cleaned.length === 0) return '';

        let hours = cleaned.slice(0, 2);
        let minutes = cleaned.slice(2);

        if (hours.length === 2) {
            let h = parseInt(hours, 10);
            if (h > 23) h = 23;
            hours = h.toString().padStart(2, '0');
        }

        if (minutes.length === 2) {
            let m = parseInt(minutes, 10);
            if (m > 59) m = 59;
            minutes = m.toString().padStart(2, '0');
        }

        if (minutes.length > 0) {
            return `${hours}:${minutes}`;
        }
        return hours;
    };

    return (
        <View style={styles.formContent}>
            <Text style={styles.sectionTitle}>Horário de funcionamento:</Text>
            <View style={styles.twoColumnContainer}>
                {DAYS_OF_WEEK_CONFIG.map((day) => {
                    const dayData = operatingHours[day.id] || { selected: false, open: '', close: '' };
                    
                    return (
                        <View style={styles.dayEntrySectionColumnItemContainer}>
                            <TouchableOpacity 
                                style={styles.dayEntrySectionColumnItem}
                                onPress={() => handleCheckBoxChange(day.id)}
                            >
                                <View key={day.id} style={styles.dayEntryWrapper}>
                                    <View style={styles.dayLabelCheckboxRow}>
                                        <Text style={styles.dayLabel}>{day.label}</Text>
                                        <CheckBox
                                            style={styles.checkBox}
                                            value={dayData.selected}
                                            onValueChange={() => handleCheckBoxChange(day.id)}
                                            color={dayData.selected ? 'green' : undefined}
                                        />
                                    </View>
                                    {dayData.selected && (
                                        <View style={styles.timeInputsContainer}>
                                            <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Abre:</Text>
                                                <TextInput
                                                    style={styles.dayInput}
                                                    value={dayData.open}
                                                    onChangeText={(text) => handleTimeChange(day.id, 'open', formatTime(text))}
                                                    placeholder="HH:MM"
                                                    maxLength={5}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                            <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Fecha:</Text>
                                                <TextInput
                                                    style={styles.dayInput}
                                                    value={dayData.close}
                                                    onChangeText={(text) => handleTimeChange(day.id, 'close', formatTime(text))}
                                                    placeholder="HH:MM"
                                                    maxLength={5} 
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                })}
                <View style={styles.dayEntrySectionColumnItemContainer}>
                    <TouchableOpacity 
                        style={styles.dayEntrySectionColumnItem}
                        onPress={() => handleCheckBoxChange(8)}
                    >
                        <View style={styles.dayEntryWrapper}>
                            <View style={styles.dayLabelCheckboxRow}>
                                <Text style={styles.dayLabel}>Dias úteis</Text>
                                <CheckBox
                                    style={styles.checkBox}
                                    value={operatingHours[8].selected}
                                    onValueChange={() => handleCheckBoxChange(8)}
                                    color={operatingHours[8].selected ? 'green' : undefined}
                                />
                            </View>
                            {operatingHours[8].selected && (
                                <View style={styles.timeInputsContainer}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Abre:</Text>
                                        <TextInput
                                            style={styles.dayInput}
                                            value={operatingHours[8].open}
                                            onChangeText={(text) => handleTimeChange(8, 'open', formatTime(text))}
                                            placeholder="HH:MM"
                                            maxLength={5}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Fecha:</Text>
                                        <TextInput
                                            style={styles.dayInput}
                                            value={operatingHours[8].close}
                                            onChangeText={(text) => handleTimeChange(8, 'close', formatTime(text))}
                                            placeholder="HH:MM"
                                            maxLength={5}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    formContent: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center', 
        padding: 1,
        marginTop: 90,
        paddingHorizontal: 20,
    },
    twoColumnContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
    },
    dayEntrySectionColumnItemContainer: {
        height: 130,
        marginBottom: 10,
        width: '45%',
    },
    dayEntrySectionColumnItem: {
        width: '100%',
        marginBottom: 10,
    },
    dayEntryWrapper: {
        flexDirection: 'column',
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#888',
        borderRadius: 8,
        width: '100%',
        backgroundColor: '#f8f4f4',
    },
    dayLabelCheckboxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    dayLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    checkBox: {
        marginLeft: 10,
        borderRadius: 10
    },
    timeInputsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    inputGroup: {
        flexDirection: 'column',
    },
    inputLabel: {
        fontSize: 14,
        marginBottom: 5,
    },
    dayInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        height: 40,
        width: 66,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 5,
    },
});