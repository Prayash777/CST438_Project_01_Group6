import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'

interface PixelGridProps {
  trackingData: Record<string, boolean>
  onToggle?: (date: string) => void
  color?: string
  weekdays?: string[]
}

export function PixelGrid({ 
  trackingData, 
  onToggle, 
  color = '#4CAF50',
  weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
}: PixelGridProps) {
  const dates = Object.keys(trackingData).sort()
  
  // Group dates into rows of 7
  const rows = dates.reduce<string[][]>((acc, date, index) => {
    const rowIndex = Math.floor(index / 7)
    if (!acc[rowIndex]) {
      acc[rowIndex] = []
    }
    acc[rowIndex].push(date)
    return acc
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {weekdays.map((day) => (
          <View key={day} style={styles.labelContainer}>
            <Text style={styles.label}>{day}</Text>
          </View>
        ))}
      </View>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((date) => (
            <TouchableOpacity
              key={date}
              style={[
                styles.pixel,
                { backgroundColor: trackingData[date] ? color : '#E0E0E0' }
              ]}
              onPress={() => onToggle?.(date)}
            />
          ))}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  pixel: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  labelContainer: {
    width: 40,
    alignItems: 'center',
  },
  label: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  }
}) 