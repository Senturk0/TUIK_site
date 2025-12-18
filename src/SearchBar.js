import React, { useState } from 'react';
// Opsiyonel: Stil için bir CSS dosyası (örneğin SearchBar.css) import edilebilir.
// import './SearchBar.css';

/**
 * Arama çubuğu bileşeni.
 * Arama terimini yönetir ve 'onSearch' prop'u aracılığıyla arama işlemini başlatır.
 *
 * @param {object} props
 * @param {function(string)} props.onSearch - Kullanıcı arama yaptığında çağrılacak işlev.
 */
const SearchBar = ({ onSearch }) => {
  // Arama input'unun değerini tutmak için state
  const [searchTerm, setSearchTerm] = useState('');

  // Input değeri değiştikçe state'i güncelle
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Form gönderildiğinde (Ara butonuna basıldığında veya Enter'a tıklandığında)
  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Formun varsayılan sayfa yenileme davranışını engelle
    
    // Eğer bir arama işlevi prop olarak geldiyse, mevcut arama terimiyle çağır
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <form className="search-bar-container" onSubmit={handleSearchSubmit}>
      <input
        type="text"
        placeholder="TÜİK verilerinde arama yapın..."
        value={searchTerm}
        onChange={handleInputChange}
        className="search-input"
        aria-label="Arama Kutusu"
      />
      <button type="submit" className="search-button">
        Ara
      </button>
    </form>
  );
};

export default SearchBar;