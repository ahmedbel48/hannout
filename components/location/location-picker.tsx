
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Check, ChevronDown, MapPin, Search, X } from 'lucide-react-native';
import {
  Country,
  City,
} from 'country-state-city';

type LocationPickerProps = {
  country: string;
  city: string;
  onChange: (country: string, city: string) => void;
};

type SelectionType = 'country' | 'city';

export default function LocationPicker({
  country,
  city,
  onChange,
}: LocationPickerProps) {
  const [selection, setSelection] = useState<SelectionType | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('');

  const countries = useMemo(
    () => Country.getAllCountries().sort((a, b) =>
      a.name.localeCompare(b.name, 'fr')
    ),
    []
  );

  const cities = useMemo(() => {
    if (!selectedCountryCode) return [];

    return City.getCitiesOfCountry(selectedCountryCode) ?? [];
  }, [selectedCountryCode]);

  const filteredCountries = countries.filter((item) =>
    item.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const filteredCities = cities.filter((item) =>
    item.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  function openCountries() {
    setSearch('');
    setSelection('country');
  }

  function openCities() {
    const currentCountry = countries.find(
      (item) => item.name === country
    );

    if (!currentCountry) return;

    setSelectedCountryCode(currentCountry.isoCode);
    setSearch('');
    setSelection('city');
  }

  function chooseCountry(item: (typeof countries)[number]) {
    setSelectedCountryCode(item.isoCode);
    onChange(item.name, '');
    setSearch('');
    setSelection('city');
  }

  function chooseCity(item: (typeof cities)[number]) {
    onChange(country, item.name);
    setSelection(null);
    setSearch('');
  }

  return (
    <View>
      <Text className="mb-2 text-sm font-bold text-gray-800">
        Pays
      </Text>

      <Pressable
        onPress={openCountries}
        className="mb-4 flex-row items-center rounded-2xl border border-gray-200 bg-[#FAFAFA] p-4"
      >
        <MapPin size={19} color="#15803D" />
        <Text className="ml-3 flex-1 font-semibold text-gray-800">
          {country || 'Choisir un pays'}
        </Text>
        <ChevronDown size={19} color="#64748B" />
      </Pressable>

      <Text className="mb-2 text-sm font-bold text-gray-800">
        Ville
      </Text>

      <Pressable
        onPress={openCities}
        disabled={!country}
        className={`flex-row items-center rounded-2xl border border-gray-200 p-4 ${
          country ? 'bg-[#FAFAFA]' : 'bg-gray-100'
        }`}
      >
        <MapPin size={19} color="#15803D" />
        <Text className="ml-3 flex-1 font-semibold text-gray-800">
          {city || 'Choisir une ville'}
        </Text>
        <ChevronDown size={19} color="#64748B" />
      </Pressable>

      <Modal
        visible={selection !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelection(null)}
      >
        <View className="flex-1 bg-[#F7F8F5] pt-5">
          <View className="flex-row items-center justify-between px-5 pb-4">
            <Text className="text-xl font-bold text-gray-900">
              {selection === 'country' ? 'Choisir un pays' : 'Choisir une ville'}
            </Text>

            <Pressable
              onPress={() => setSelection(null)}
              className="h-10 w-10 items-center justify-center rounded-full bg-white"
            >
              <X size={20} color="#374151" />
            </Pressable>
          </View>

          <View className="mx-5 mb-4 flex-row items-center rounded-2xl border border-gray-200 bg-white px-4">
            <Search size={19} color="#94A3B8" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Rechercher..."
              placeholderTextColor="#9CA3AF"
              className="ml-3 flex-1 py-4 text-gray-900"
            />
          </View>

          <ScrollView keyboardShouldPersistTaps="handled">
            {selection === 'country' &&
              filteredCountries.map((item) => (
                <Pressable
                  key={item.isoCode}
                  onPress={() => chooseCountry(item)}
                  className="mx-5 flex-row items-center justify-between border-b border-gray-200 px-2 py-4"
                >
                  <Text className="font-medium text-gray-800">
                    {item.name}
                  </Text>
                  {country === item.name && (
                    <Check size={19} color="#15803D" />
                  )}
                </Pressable>
              ))}

            {selection === 'city' &&
              filteredCities.map((item, index) => (
                <Pressable
                  key={`${item.name}-${index}`}
                  onPress={() => chooseCity(item)}
                  className="mx-5 flex-row items-center justify-between border-b border-gray-200 px-2 py-4"
                >
                  <Text className="font-medium text-gray-800">
                    {item.name}
                  </Text>
                  {city === item.name && (
                    <Check size={19} color="#15803D" />
                  )}
                </Pressable>
              ))}

            {((selection === 'country' && filteredCountries.length === 0) ||
              (selection === 'city' && filteredCities.length === 0)) && (
              <Text className="px-6 py-10 text-center text-gray-500">
                Aucun résultat trouvé.
              </Text>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
