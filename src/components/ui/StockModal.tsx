import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface BuyModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, quantity: string) => void;
  defaultName?: string;
  defaultQuantity?: string;
  type: 'buy';
  stockData: any;
}

interface SellModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (sellPrice: string, sellQuantity: string, tax: string, soldStockId?: number) => void;
  defaultName?: string;
  defaultQuantity?: string;
  type: 'sell';
  stockData: any;
}

type StockModalProps = BuyModalProps | SellModalProps;

const StockModal = ({
  visible,
  onClose,
  onSubmit,
  defaultName = '',
  defaultQuantity = '',
  type,
  stockData,
}: StockModalProps) => {
  // Buy modal states
  const [name, setName] = useState(defaultName);
  const [quantity, setQuantity] = useState(defaultQuantity);
  
  // Sell modal states
  const [sellPrice, setSellPrice] = useState('');
  const [sellQuantity, setSellQuantity] = useState('');
  const [tax, setTax] = useState('7.5');
  const [selectedStockId, setSelectedStockId] = useState<number | undefined>(undefined);

  // Get max quantity based on selection
  const getMaxQuantity = () => {
    if (selectedStockId && stockData?.multidata) {
      const selectedStock = stockData.multidata.find((item: any) => item.id === selectedStockId);
      return selectedStock?.quantity || 0;
    }
    return stockData?.quantity || 0;
  };

  // Reset state when modal opens/closes or type changes
  useEffect(() => {
    if (visible) {
      if (type === 'buy') {
        setName(defaultName);
        setQuantity(defaultQuantity);
      } else {
        setSellPrice(stockData?.ltp?.toString() || '');
        setSellQuantity('');
        setTax('7.5');
        setSelectedStockId(undefined);
      }
    }
  }, [visible, type, defaultName, defaultQuantity, stockData]);

  const handleClose = () => {
    // Reset all states
    setName('');
    setQuantity('');
    setSellPrice('');
    setSellQuantity('');
    setTax('7.5');
    setSelectedStockId(undefined);
    onClose();
  };

  const handleSubmit = () => {
    if (type === 'buy') {
      if (!name.trim() || !quantity.trim()) {
        alert('Please fill all fields');
        return;
      }
      (onSubmit as BuyModalProps['onSubmit'])(name, quantity);
    } else {
      if (!sellPrice.trim() || !sellQuantity.trim()) {
        alert('Please fill all required fields');
        return;
      }
      
      // Validate quantity
      const maxQty = getMaxQuantity();
      const sellQty = parseFloat(sellQuantity);
      
      if (sellQty > maxQty) {
        alert(`Cannot sell more than ${maxQty} units`);
        return;
      }
      
      if (sellQty <= 0) {
        alert('Quantity must be greater than 0');
        return;
      }
      
      (onSubmit as SellModalProps['onSubmit'])(sellPrice, sellQuantity, tax, selectedStockId);
    }
    handleClose();
  };

  console.log('StockModal type:', type);
  console.log('StockModal stockData:', stockData);

  const maxQuantity = type === 'sell' ? getMaxQuantity() : 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {type === 'sell' ? 'Sell Stock' : 'Buy Stock'}
          </Text>

          {type === 'sell' ? (
            // Sell Modal Content
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Stock: {stockData?.symbol}</Text>
              <Text style={styles.label}>Available: {stockData?.quantity} units</Text>
              
              {/* Show multi-stock selection if available */}
              {stockData?.multi && stockData?.multidata?.length > 0 && (
                <View style={styles.stockSelection}>
                  <Text style={styles.label}>Select Stock Batch:</Text>
                  {stockData.multidata.map((item: any, index: number) => (
                    <Pressable
                      key={item.id || index}
                      style={[
                        styles.stockOption,
                        selectedStockId === item.id && styles.stockOptionSelected
                      ]}
                      onPress={() => setSelectedStockId(item.id)}
                    >
                      <Text style={styles.stockOptionText}>
                        {item.user_name} - {item.quantity} units @ {item.buyPrice}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}

              <TextInput
                placeholder="Sell Price"
                value={sellPrice}
                onChangeText={setSellPrice}
                keyboardType="numeric"
                style={styles.input}
              />
              
              <View>
                <TextInput
                  placeholder="Quantity to Sell"
                  value={sellQuantity}
                  onChangeText={setSellQuantity}
                  keyboardType="numeric"
                  style={styles.input}
                />
                <Text style={styles.helperText}>Max: {maxQuantity} units</Text>
              </View>
              
              {/* Capital Gain Tax Radio Buttons */}
              <View style={styles.taxContainer}>
                <Text style={styles.label}>Capital Gain Tax:</Text>
                <View style={styles.radioGroup}>
                  <Pressable
                    style={styles.radioOption}
                    onPress={() => setTax('7.5')}
                  >
                    <View style={styles.radioCircle}>
                      {tax === '7.5' && <View style={styles.radioSelected} />}
                    </View>
                    <Text style={styles.radioText}>7.5%</Text>
                  </Pressable>
                  
                  <Pressable
                    style={styles.radioOption}
                    onPress={() => setTax('5')}
                  >
                    <View style={styles.radioCircle}>
                      {tax === '5' && <View style={styles.radioSelected} />}
                    </View>
                    <Text style={styles.radioText}>5%</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          ) : (
            // Buy Modal Content
            <>
              <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <TextInput
                placeholder="Quantity"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                style={styles.input}
              />
            </>
          )}

          <View style={styles.buttons}>
            <Pressable style={styles.button} onPress={handleClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>
                {type === 'sell' ? 'Sell' : 'Buy'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default StockModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 8,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: -4,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  stockSelection: {
    marginVertical: 12,
  },
  stockOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: '#f9f9f9',
  },
  stockOptionSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  stockOptionText: {
    fontSize: 14,
  },
  taxContainer: {
    marginVertical: 12,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
    backgroundColor: '#aaa',
  },
  submitButton: { 
    backgroundColor: '#2196F3',
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 16,
  },
});