import { useEffect, useState } from 'react';
import { Search, Film, Play } from 'lucide-react';

export function CINEAPI() {
  const [peliculas, setPeliculas] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaDebounced, setBusquedaDebounced] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setBusquedaDebounced(busqueda);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  useEffect(() => {
    if (!selectedPet) return;

    const URL_API_PELICULAS = `https://67e0533f7635238f9aad3a5d.mockapi.io/user/pelis/Bsz/Pelis/${selectedPet}`;

    setLoading(true);
    fetch(URL_API_PELICULAS)
      .then(res => res.json())
      .then(data => {
        if (data?.Pelis?.[0]) {
          const keys = Object.keys(data.Pelis[0]);
          const primeraCategoria = keys[0];
          setCategoria(primeraCategoria);
          setPeliculas(data.Pelis[0][primeraCategoria]);
        } else {
          setCategoria('Sin datos');
          setPeliculas([]);
        }
      })
      .catch(err => {
        console.error("Error al cargar datos:", err);
        setCategoria('Error');
        setPeliculas([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedPet]);

  const handleChange = (event) => {
    setSelectedPet(event.target.value);
    setBusqueda('');
  };

  const categorias = [
    { value: "", label: "Seleccionar categoría" },
    { value: "1", label: "Terror" },
    { value: "3", label: "Romance" },
    { value: "4", label: "Comedia" },
    { value: "5", label: "Animación" },
    { value: "6", label: "Acción" },
    { value: "7", label: "Guerra" },
    { value: "8", label: "Recientes" },
    { value: "9", label: "Del 2024" }
  ];

  const peliculasFiltradas = peliculas.filter((peliculax) =>
    peliculax.h2?.toLowerCase().includes(busquedaDebounced.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white">
      {/* Header oscuro */}
      <div className="w-full bg-zinc-800/80 border-b border-zinc-700 top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center mb-8">
            <Film className="w-8 h-8 text-white mr-3" />
            <h1 className="text-3xl font-light tracking-wide">
              ANGELOPELIS
            </h1>
          </div>

          {/* Selector */}
          <div className="max-w-md mx-auto mb-6">
            <select
              value={selectedPet}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white font-light focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all duration-200"
            >
              {categorias.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-zinc-800">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Búsqueda */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar película..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg pl-12 pr-4 py-3 text-white font-light focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {categoria && (
          <h2 className="text-center text-4xl font-extralight text-white mb-12 tracking-wider uppercase">
            {categoria}
          </h2>
        )}

        {/* Cargando */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-2 border-zinc-700 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-400 font-light">Cargando películas...</p>
          </div>
        )}

        {/* Películas */}
        {!loading && peliculasFiltradas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {peliculasFiltradas.map((pelicula, index) => (
              <div
                key={index}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <a href={pelicula.openMovie} className="block">
                  <div className="relative overflow-hidden rounded-xl shadow-lg bg-zinc-800">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={pelicula.img}
                        alt={`Poster de ${pelicula.h2}`}
                      />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center justify-center mb-3">
                          <Play className="w-12 h-12 text-white opacity-90" />
                        </div>
                        <h3 className="text-white text-lg font-light text-center leading-tight">
                          {pelicula.h2}
                        </h3>
                      </div>
                    </div>

                    {/* Título inferior */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 group-hover:opacity-0 transition-opacity duration-300">
                      <h3 className="text-white text-sm font-light text-center leading-tight">
                        {pelicula.h2}
                      </h3>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Estado vacío */}
        {!loading && selectedPet && peliculasFiltradas.length === 0 && (
          <div className="text-center py-20">
            <Film className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 font-light text-lg">
              No se encontraron películas
            </p>
          </div>
        )}

        {/* Estado inicial */}
        {!selectedPet && (
          <div className="text-center py-20">
            <Film className="w-20 h-20 text-zinc-700 mx-auto mb-6" />
            <p className="text-zinc-500 font-light text-xl">
              Selecciona una categoría para comenzar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
