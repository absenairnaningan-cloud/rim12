import React, { useRef, useEffect, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AspirasiPublik } from '../types';
import {
  TANGGAMUS_GEOJSON,
  TANGGAMUS_LANDMARKS,
  TanggamusGeoFeature,
} from '../data/tanggamusGeoData';

interface PetaAspirasiTanggamusProps {
  aspirasiList: AspirasiPublik[];
  onSelectAspirasi: (item: AspirasiPublik) => void;
  onFilterKecamatanChange: (kecamatan: string) => void;
  onOpenFormAspirasiWithKecamatan?: (kecamatan: string) => void;
  onVoteAspirasi: (id: string) => void;
}

type MetricMode = 'aspirasi' | 'suara' | 'rkpd';

// Color interpolation helper without external D3 dependency
function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 255;
  const g1 = (c1 >> 8) & 255;
  const b1 = c1 & 255;

  const r2 = (c2 >> 16) & 255;
  const g2 = (c2 >> 8) & 255;
  const b2 = c2 & 255;

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export const PetaAspirasiTanggamus: React.FC<PetaAspirasiTanggamusProps> = ({
  aspirasiList,
  onSelectAspirasi,
  onFilterKecamatanChange,
  onOpenFormAspirasiWithKecamatan,
  onVoteAspirasi,
}) => {
  const leafletContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [metricMode, setMetricMode] = useState<MetricMode>('aspirasi');
  const [selectedKecamatanName, setSelectedKecamatanName] = useState<string | null>(null);
  const [showPolygons, setShowPolygons] = useState<boolean>(true);
  const [polygonOpacity, setPolygonOpacity] = useState<number>(0.35);
  const [showBorderLine, setShowBorderLine] = useState<boolean>(false);

  // Compute aggregated stats per kecamatan
  const statsMap = useMemo(() => {
    const map = new Map<string, {
      totalAspirasi: number;
      totalSuara: number;
      masukRkpdCount: number;
      ditelaahCount: number;
      misiCount: Record<string, number>;
      items: AspirasiPublik[];
    }>();

    // Initialize all 20 kecamatan
    TANGGAMUS_GEOJSON.features.forEach((f) => {
      map.set(f.properties.name, {
        totalAspirasi: 0,
        totalSuara: 0,
        masukRkpdCount: 0,
        ditelaahCount: 0,
        misiCount: {},
        items: [],
      });
    });

    // Populate with actual aspirasi
    aspirasiList.forEach((item) => {
      let stats = map.get(item.kecamatan);
      if (!stats) {
        const found = Array.from(map.keys()).find((k) =>
          k.toLowerCase().includes(item.kecamatan.toLowerCase()) ||
          item.kecamatan.toLowerCase().includes(k.toLowerCase())
        );
        if (found) stats = map.get(found);
      }

      if (stats) {
        stats.totalAspirasi += 1;
        stats.totalSuara += item.dukunganSuara || 1;
        if (item.status === 'masuk_rkpd' || item.status === 'masuk_renja_pd') {
          stats.masukRkpdCount += 1;
        } else {
          stats.ditelaahCount += 1;
        }
        stats.misiCount[item.misiId] = (stats.misiCount[item.misiId] || 0) + 1;
        stats.items.push(item);
      }
    });

    return map;
  }, [aspirasiList]);

  // Overall regional metrics
  const totalMappedAspirasi = useMemo(() => {
    let sum = 0;
    statsMap.forEach((s) => (sum += s.totalAspirasi));
    return sum;
  }, [statsMap]);

  const lintasWilayahAspirasi = useMemo(() => {
    return aspirasiList.filter((a) =>
      a.kecamatan.toLowerCase().includes('lintas') ||
      a.kecamatan.toLowerCase().includes('seluruh')
    );
  }, [aspirasiList]);

  // Max value for metric scaling
  const maxMetricValue = useMemo(() => {
    let max = 1;
    statsMap.forEach((s) => {
      let val = 0;
      if (metricMode === 'aspirasi') val = s.totalAspirasi;
      else if (metricMode === 'suara') val = s.totalSuara;
      else if (metricMode === 'rkpd') val = s.masukRkpdCount;
      if (val > max) max = val;
    });
    return max;
  }, [statsMap, metricMode]);

  // Polygon fill color according to metric
  const getColor = (kecamatanName: string): string => {
    const stats = statsMap.get(kecamatanName);
    let val = 0;
    if (stats) {
      if (metricMode === 'aspirasi') val = stats.totalAspirasi;
      else if (metricMode === 'suara') val = stats.totalSuara;
      else if (metricMode === 'rkpd') val = stats.masukRkpdCount;
    }

    if (val === 0) return '#f1f5f9';

    const ratio = Math.min(1, Math.max(0.2, val / maxMetricValue));

    if (metricMode === 'aspirasi') {
      return interpolateColor('#34d399', '#064e3b', ratio);
    } else if (metricMode === 'suara') {
      return interpolateColor('#f59e0b', '#047857', ratio);
    } else {
      return interpolateColor('#38bdf8', '#0f766e', ratio);
    }
  };

  // Ranking of top districts
  const rankedKecamatan = useMemo(() => {
    return Array.from(statsMap.entries())
      .map(([name, stats]) => ({
        name,
        stats,
      }))
      .sort((a, b) => b.stats.totalAspirasi - a.stats.totalAspirasi);
  }, [statsMap]);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!leafletContainerRef.current) return;

    // Initialize map once
    if (!mapInstanceRef.current) {
      const map = L.map(leafletContainerRef.current, {
        center: [-5.46, 104.72],
        zoom: 10,
        zoomControl: true,
        minZoom: 8,
        maxZoom: 18,
      });

      // Standard OpenStreetMap street layer
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap kontributor | Bapperida Kab. Tanggamus',
        maxZoom: 19,
      });

      // Esri Satellite imagery layer
      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri &mdash; Citra Satelit Bumi Nyata',
          maxZoom: 18,
        }
      );

      // Carto Positron clean light layer
      const cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO &copy; OpenStreetMap',
        maxZoom: 19,
      });

      // Default layer: OpenStreetMap for clear street and settlement names
      osmLayer.addTo(map);

      // Layer Control in Top Right
      L.control.layers(
        {
          '🗺️ Peta Jalan & Wilayah (OpenStreetMap)': osmLayer,
          '🛰️ Citra Satelit Alami (Esri)': satelliteLayer,
          '⚪ Peta Terang Minimalis (Carto)': cartoLight,
        },
        undefined,
        { position: 'topright' }
      ).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Re-draw GeoJSON Boundaries with dynamic choropleth styling
    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
    }

    const geoJsonLayer = L.geoJSON(TANGGAMUS_GEOJSON as any, {
      style: (feature) => {
        const name = feature?.properties?.name;
        const isSelected = name === selectedKecamatanName;
        return {
          fillColor: getColor(name),
          fillOpacity: !showPolygons ? 0.02 : isSelected ? Math.min(0.85, polygonOpacity + 0.35) : polygonOpacity,
          stroke: isSelected ? true : showBorderLine,
          color: isSelected ? '#047857' : '#475569',
          weight: isSelected ? 2.5 : showBorderLine ? 1 : 0,
          dashArray: '',
          opacity: isSelected ? 0.9 : showBorderLine ? 0.4 : 0,
        };
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties.name;
        const alias = feature.properties.alias;
        const stats = statsMap.get(name);
        const count = stats?.totalAspirasi || 0;

        layer.on({
          mouseover: (e) => {
            const target = e.target;
            target.setStyle({
              fillOpacity: Math.min(0.7, polygonOpacity + 0.2),
              stroke: true,
              weight: 2,
              color: '#047857',
            });
            target.bringToFront();
          },
          mouseout: (e) => {
            geoJsonLayer.resetStyle(e.target);
          },
          click: () => {
            setSelectedKecamatanName(name);
          },
        });

        // Hover tooltip on the polygon
        layer.bindTooltip(
          `<strong>${alias}</strong><br/>${count} Usulan Aspirasi Terdaftar`,
          {
            direction: 'center',
            className: 'leaflet-custom-tooltip font-sans font-semibold text-xs',
            permanent: false,
          }
        );
      },
    }).addTo(map);

    geoJsonLayerRef.current = geoJsonLayer;

    // Re-draw District Markers & Landmark Pins
    if (markersLayerRef.current) {
      map.removeLayer(markersLayerRef.current);
    }

    const markersGroup = L.layerGroup().addTo(map);

    // 20 Kecamatan centroid badges
    TANGGAMUS_GEOJSON.features.forEach((feature) => {
      const [lng, lat] = feature.properties.center;
      const stats = statsMap.get(feature.properties.name);
      const aspirasiCount = stats?.totalAspirasi || 0;
      const isSelected = feature.properties.name === selectedKecamatanName;

      const markerHtml = `
        <div style="
          background: ${isSelected ? '#064e3b' : aspirasiCount > 0 ? '#047857' : '#334155'};
          color: white;
          border: 2px solid white;
          border-radius: 9999px;
          padding: 3px 8px;
          font-size: 11px;
          font-weight: 700;
          font-family: ui-sans-serif, system-ui;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.35);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          transform: translate(-50%, -50%);
          transition: transform 0.15s ease-in-out;
        ">
          <span>📍 ${feature.properties.alias}</span>
          <span style="
            background: rgba(255, 255, 255, 0.28);
            padding: 1px 6px;
            border-radius: 9999px;
            font-family: monospace;
            font-size: 10px;
          ">${aspirasiCount}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'kecamatan-badge-icon',
        html: markerHtml,
        iconSize: [120, 28],
        iconAnchor: [60, 14],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(markersGroup);

      // Popup
      const popupHtml = `
        <div style="font-family: ui-sans-serif, system-ui; padding: 4px; min-width: 210px;">
          <h4 style="margin: 0 0 3px 0; font-size: 13px; font-weight: bold; color: #064e3b;">
            ${feature.properties.name}
          </h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b;">
            Ibukota: <strong>${feature.properties.ibuKotaKecamatan}</strong> (${feature.properties.jumlahPekon} Pekon)
          </p>
          <div style="background: #f8fafc; padding: 6px; border-radius: 6px; font-size: 11px; margin-bottom: 8px; border: 1px solid #e2e8f0;">
            <div>Usulan Aspirasi: <strong style="color: #047857;">${aspirasiCount} Usulan</strong></div>
            <div>Dukungan Suara: <strong style="color: #b45309;">${stats?.totalSuara || 0} Suara</strong></div>
          </div>
          <button id="btn-popup-inspect-${feature.properties.id}" style="
            width: 100%;
            background: #064e3b;
            color: white;
            border: none;
            padding: 6px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
          ">
            Buka Panel Detail Usulan
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-inspect-${feature.properties.id}`);
        if (btn) {
          btn.onclick = () => {
            setSelectedKecamatanName(feature.properties.name);
          };
        }
      });

      marker.on('click', () => {
        setSelectedKecamatanName(feature.properties.name);
      });
    });

    // Strategic Landmarks
    TANGGAMUS_LANDMARKS.forEach((lm) => {
      const [lng, lat] = lm.coordinates;
      const iconEmoji =
        lm.type === 'mountain' ? '🌋' : lm.type === 'water' ? '💧' : lm.type === 'tourism' ? '🐬' : '🏛️';

      const lmIcon = L.divIcon({
        className: 'landmark-icon',
        html: `
          <div style="
            background: #0f172a;
            color: #f8fafc;
            border: 2px solid #38bdf8;
            border-radius: 6px;
            padding: 2px 6px;
            font-size: 10px;
            font-weight: 600;
            box-shadow: 0 2px 5px rgba(0,0,0,0.4);
            white-space: nowrap;
            transform: translate(-50%, -50%);
          ">
            ${iconEmoji} ${lm.name}
          </div>
        `,
        iconSize: [110, 22],
        iconAnchor: [55, 11],
      });

      L.marker([lat, lng], { icon: lmIcon })
        .addTo(markersGroup)
        .bindPopup(
          `<strong>${lm.name}</strong><br/><span style="font-size: 11px; color: #475569;">${lm.keterangan}</span>`
        );
    });

    markersLayerRef.current = markersGroup;

    // Pan to selected district if any
    if (selectedKecamatanName) {
      const feat = TANGGAMUS_GEOJSON.features.find((f) => f.properties.name === selectedKecamatanName);
      if (feat) {
        const [lng, lat] = feat.properties.center;
        map.setView([lat, lng], 11, { animate: true });
      }
    }
  }, [metricMode, selectedKecamatanName, statsMap, maxMetricValue, showPolygons, polygonOpacity, showBorderLine]);

  // Center reset handler
  const handleResetMapCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([-5.46, 104.72], 10, { animate: true });
      setSelectedKecamatanName(null);
    }
  };

  // Currently selected district properties & stats
  const activeFeature = useMemo(() => {
    if (!selectedKecamatanName) return null;
    return TANGGAMUS_GEOJSON.features.find(
      (f) => f.properties.name === selectedKecamatanName
    );
  }, [selectedKecamatanName]);

  const activeStats = useMemo(() => {
    if (!selectedKecamatanName) return null;
    return statsMap.get(selectedKecamatanName) || null;
  }, [selectedKecamatanName, statsMap]);

  return (
    <section
      id="peta-sebaran-aspirasi"
      className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden p-5 sm:p-6 lg:p-7 space-y-6 animate-fade-in"
    >
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
              🛰️ Peta Geospasial Nyata Interaktif
            </span>
            <span className="text-xs font-mono text-stone-500">
              20 Kecamatan • 299 Pekon & 3 Kelurahan Tanggamus
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Peta Sebaran Aspirasi & Kebutuhan Wilayah
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Peta geografis resolusi tinggi berbasis OpenStreetMap dan citra satelit asli. Menampilkan batas administratif 20 kecamatan, jalan poros daerah, dan titik persebaran usulan warga Kabupaten Tanggamus.
          </p>
        </div>

        {/* Metric Selector Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-600 mr-1">Indikator Warna:</span>
          <div className="bg-stone-100 p-1 rounded-xl border border-stone-200 flex items-center gap-1 text-xs">
            <button
              onClick={() => setMetricMode('aspirasi')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                metricMode === 'aspirasi'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/70'
              }`}
            >
              Jumlah Usulan
            </button>
            <button
              onClick={() => setMetricMode('suara')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                metricMode === 'suara'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/70'
              }`}
            >
              Dukungan Warga
            </button>
            <button
              onClick={() => setMetricMode('rkpd')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                metricMode === 'rkpd'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/70'
              }`}
            >
              Masuk RKPD
            </button>
          </div>
        </div>
      </div>

      {/* Layer Display Controls & Border Precision Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-stone-700">Tampilan Peta:</span>
          <button
            type="button"
            onClick={() => setShowPolygons(!showPolygons)}
            className={`px-2.5 py-1 rounded-lg font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
              showPolygons
                ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
            }`}
          >
            <span>{showPolygons ? '✓' : '○'}</span>
            <span>Warna Tematik Kecamatan</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowPolygons(false);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
              !showPolygons
                ? 'bg-sky-800 text-white border-sky-900 shadow-2xs'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
            }`}
            title="Sembunyikan poligon warna untuk melihat batas wilayah dan garis pantai resmi di OpenStreetMap"
          >
            <span>🗺️</span>
            <span>Batas Resmi OpenStreetMap</span>
          </button>
        </div>

        {/* Opacity & Border Style Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {showPolygons && (
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-2 py-1">
              <span className="text-stone-500 font-medium">Kepekatan Warna:</span>
              {[
                { label: 'Lembut', val: 0.2 },
                { label: 'Sedang', val: 0.4 },
                { label: 'Tegas', val: 0.65 },
              ].map((lvl) => (
                <button
                  key={lvl.label}
                  type="button"
                  onClick={() => setPolygonOpacity(lvl.val)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    polygonOpacity === lvl.val
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowBorderLine(!showBorderLine)}
            className={`px-2.5 py-1 rounded-lg font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
              showBorderLine
                ? 'bg-stone-800 text-white border-stone-900 shadow-2xs'
                : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-100'
            }`}
            title="Tampilkan atau sembunyikan garis batas wilayah antar-kecamatan"
          >
            <span>{showBorderLine ? '✓' : '⊘'}</span>
            <span>Garis Batas: {showBorderLine ? 'Aktif' : 'Dihilangkan (Bersih)'}</span>
          </button>
        </div>
      </div>

      {/* Main Map Container + Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Leaflet Interactive Map Viewport */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <div className="relative w-full rounded-2xl border-2 border-stone-300 overflow-hidden shadow-md bg-stone-100 min-h-[500px] sm:min-h-[560px]">
            {/* Real Leaflet Map Canvas */}
            <div
              ref={leafletContainerRef}
              className="w-full h-[520px] sm:h-[580px] z-0"
            />

            {/* Floating Map Reset Button (Bottom Left) */}
            <div className="absolute bottom-4 left-4 z-10">
              <button
                type="button"
                onClick={handleResetMapCenter}
                className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-300 shadow-md text-xs font-semibold text-stone-800 hover:bg-stone-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Kembalikan Tampilan Penuh Kabupaten Tanggamus"
              >
                <span>↺</span>
                <span>Fokus Seluruh Tanggamus</span>
              </button>
            </div>

            {/* High-Contrast Legend Overlay (Bottom Right) */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-stone-300 shadow-md z-10 text-[10px] text-stone-800 font-medium pointer-events-auto">
              <span className="font-bold block mb-1.5 text-stone-900">
                Tingkat {metricMode === 'aspirasi' ? 'Jumlah Usulan' : metricMode === 'suara' ? 'Dukungan Warga' : 'Masuk RKPD'}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-stone-600">0</span>
                <div
                  className="w-28 h-3 rounded-md border border-stone-300 shadow-2xs"
                  style={{
                    background:
                      metricMode === 'aspirasi'
                        ? 'linear-gradient(to right, #f1f5f9, #34d399, #059669, #064e3b)'
                        : metricMode === 'suara'
                        ? 'linear-gradient(to right, #f1f5f9, #fde68a, #f59e0b, #047857)'
                        : 'linear-gradient(to right, #f1f5f9, #38bdf8, #0f766e, #164e63)',
                  }}
                />
                <span className="font-mono font-bold text-emerald-950">{maxMetricValue}+</span>
              </div>
            </div>
          </div>

          {/* Quick Filter Search and Selector Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-stone-700 font-bold whitespace-nowrap">Pilih Kecamatan:</span>
              <select
                value={selectedKecamatanName || ''}
                onChange={(e) => setSelectedKecamatanName(e.target.value || null)}
                className="bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 w-full sm:w-64 shadow-2xs cursor-pointer"
              >
                <option value="">-- Fokuskan Wilayah Kecamatan --</option>
                {TANGGAMUS_GEOJSON.features.map((f) => {
                  const c = statsMap.get(f.properties.name)?.totalAspirasi || 0;
                  return (
                    <option key={f.properties.id} value={f.properties.name}>
                      {f.properties.name} ({c} usulan)
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-center gap-3 text-stone-600 w-full sm:w-auto justify-end">
              {selectedKecamatanName && (
                <button
                  onClick={() => setSelectedKecamatanName(null)}
                  className="text-stone-700 hover:text-stone-900 underline text-xs font-semibold cursor-pointer"
                >
                  ✕ Batalkan Pilihan
                </button>
              )}
              <span className="font-mono text-stone-600 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                Terpetakan: <strong className="text-emerald-900 font-bold">{totalMappedAspirasi}</strong> usulan wilayah
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Inspector Panel for Selected / Top Districts */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {activeFeature && activeStats ? (
            /* Selected District Inspector Card */
            <div className="bg-stone-50 rounded-2xl border-2 border-emerald-600 p-5 space-y-4 shadow-md animate-fade-in relative">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded-md font-bold">
                    Lokus Wilayah Terpilih
                  </span>
                  <h3 className="text-xl font-serif font-bold text-stone-900 mt-1">
                    {activeFeature.properties.name}
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Ibukota: <strong className="text-stone-800">{activeFeature.properties.ibuKotaKecamatan}</strong> • {activeFeature.properties.jumlahPekon} Pekon/Desa
                  </p>
                </div>
                <button
                  onClick={() => setSelectedKecamatanName(null)}
                  className="text-stone-400 hover:text-stone-800 p-1 text-base rounded cursor-pointer leading-none"
                  title="Tutup Panel"
                >
                  ✕
                </button>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs">
                  <span className="block text-[10px] text-stone-500 font-semibold uppercase">Total Usulan</span>
                  <span className="text-lg font-bold text-emerald-900 font-mono">
                    {activeStats.totalAspirasi}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs">
                  <span className="block text-[10px] text-stone-500 font-semibold uppercase">Dukungan</span>
                  <span className="text-lg font-bold text-amber-700 font-mono">
                    {activeStats.totalSuara}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs">
                  <span className="block text-[10px] text-stone-500 font-semibold uppercase">Masuk RKPD</span>
                  <span className="text-lg font-bold text-teal-800 font-mono">
                    {activeStats.masukRkpdCount}
                  </span>
                </div>
              </div>

              {/* District Characteristic */}
              <div className="text-xs text-stone-700 bg-white p-3.5 rounded-xl border border-stone-200/90 space-y-1.5 shadow-2xs">
                <span className="font-bold text-stone-900 block text-[11px] uppercase tracking-wide">
                  Sektor Unggulan Daerah:
                </span>
                <p className="text-emerald-900 font-semibold text-xs leading-snug">
                  {activeFeature.properties.sektorUnggulan}
                </p>
                <p className="text-[11px] text-stone-600 pt-1 border-t border-stone-100 leading-relaxed">
                  {activeFeature.properties.karakteristik}
                </p>
              </div>

              {/* Recent Aspirations from this Kecamatan */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                  <span>Usulan dari {activeFeature.properties.alias}:</span>
                  <span className="text-[10px] font-mono text-stone-500 font-normal">
                    {activeStats.items.length} terdaftar
                  </span>
                </div>

                {activeStats.items.length === 0 ? (
                  <div className="bg-white p-4 rounded-xl border border-dashed border-stone-300 text-center text-xs text-stone-600">
                    <p className="font-bold text-stone-800">Belum ada aspirasi terdaftar untuk kecamatan ini.</p>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Jadilah pengusul pertama untuk menyuarakan kebutuhan pembangunan pekon Anda!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {activeStats.items.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-3 rounded-xl border border-stone-200 text-xs hover:border-emerald-600 transition-colors shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-mono text-[10px] text-stone-500 font-semibold">
                            {item.pekon ? `Pekon ${item.pekon}` : item.id}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                            item.status === 'masuk_rkpd'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-stone-100 text-stone-700'
                          }`}>
                            {item.status === 'masuk_rkpd' ? '✓ Masuk RKPD' : 'Sedang Ditelaah'}
                          </span>
                        </div>
                        <h4
                          onClick={() => onSelectAspirasi(item)}
                          className="font-bold text-stone-900 hover:text-emerald-900 cursor-pointer line-clamp-1 leading-snug"
                        >
                          {item.judul}
                        </h4>
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-100 text-[10px]">
                          <span className="text-stone-500 truncate max-w-[130px]">
                            Oleh: {item.pengusulNama}
                          </span>
                          <button
                            onClick={() => onVoteAspirasi(item.id)}
                            className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                              item.hasVoted
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            }`}
                          >
                            ▲ {item.dukunganSuara}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
                <button
                  onClick={() => onFilterKecamatanChange(activeFeature.properties.name)}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-950 text-white transition-colors cursor-pointer text-center shadow-xs"
                >
                  🔍 Tampilkan di Daftar Aspirasi Utama
                </button>
                {onOpenFormAspirasiWithKecamatan && (
                  <button
                    onClick={() => onOpenFormAspirasiWithKecamatan(activeFeature.properties.name)}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-emerald-900 hover:bg-emerald-950 text-white transition-colors cursor-pointer text-center shadow-xs"
                  >
                    + Ajukan Usulan untuk {activeFeature.properties.alias}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Default Ranking / Leaderboard Card when no district is clicked */
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                  Statistik Kewilayahan
                </span>
                <h3 className="text-base font-serif font-bold text-stone-900 mt-0.5">
                  Tingkat Partisipasi Per Kecamatan
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Klik penanda kecamatan pada peta untuk memfilter usulan dan menelaah profil kewilayahan.
                </p>
              </div>

              {/* Top Districts Participation Ranking */}
              <div className="space-y-2">
                {rankedKecamatan.slice(0, 6).map((rk, idx) => {
                  return (
                    <div
                      key={rk.name}
                      onClick={() => setSelectedKecamatanName(rk.name)}
                      className="bg-white p-3 rounded-xl border border-stone-200 hover:border-emerald-600 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                              idx === 0
                                ? 'bg-amber-100 text-amber-900'
                                : idx === 1
                                ? 'bg-slate-200 text-slate-800'
                                : idx === 2
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="font-bold text-stone-800 group-hover:text-emerald-900 transition-colors">
                            {rk.name.replace('Kecamatan ', '')}
                          </span>
                        </div>
                        <div className="text-right font-mono">
                          <span className="font-bold text-emerald-900">{rk.stats.totalAspirasi}</span>
                          <span className="text-[10px] text-stone-500 ml-1">usulan</span>
                        </div>
                      </div>

                      {/* Mini participation progress bar */}
                      <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-emerald-700 h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.max(8, Math.min(100, (rk.stats.totalAspirasi / (maxMetricValue || 1)) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cross-district / Lintas Daerah Callout */}
              {lintasWilayahAspirasi.length > 0 && (
                <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-3.5 text-xs shadow-2xs">
                  <div className="flex items-center justify-between text-emerald-900 font-bold mb-1">
                    <span>🌐 Skala Lintas Wilayah Tanggamus</span>
                    <span className="font-mono bg-emerald-200 px-2 py-0.5 rounded-md text-[10px]">
                      {lintasWilayahAspirasi.length} Program
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-snug">
                    Program makro mencakup konektivitas trans-Sumatera, DAS Way Sekampung, dan kawasan maritim Teluk Semaka.
                  </p>
                </div>
              )}

              {/* Encouragement banner for lower participation areas */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 shadow-2xs">
                <span className="font-bold block mb-0.5">📢 Suarakan Pekon Anda!</span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Bapperida membuka penjaringan usulan seluas-luasnya dari seluruh 299 pekon dan 3 kelurahan di Tanggamus.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
