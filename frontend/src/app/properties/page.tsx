'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
    Building2,
    ArrowRight,
    Home,
    Euro,
    ShieldCheck,
    ChevronRight,
    Star,
    Layout,
    Search,
    Filter,
    MapPin,
    TrendingUp,
    Calculator,
    ArrowUpDown,
    Lock,
    Heart,
    Check
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import Swal from 'sweetalert2';

import {
    useGetPropertiesQuery,
    useIncrementViewsMutation,
    useToggleSavePropertyMutation
} from '@/lib/store/features/property/propertyApi';
import { GatedData } from '@/components/gated-data';
import { cn } from '@/lib/utils';

type SortType = 'price-asc' | 'price-desc' | 'yield-desc' | 'yield-asc' | 'appreciation-desc' | 'appreciation-asc';

export default function PropertiesPage() {
    const auth = useSelector((state: RootState) => state.auth);

    // Filter States
    const [search, setSearch] = useState('');
    const [country, setCountry] = useState('All');
    const [city, setCity] = useState('All');
    
    // Price
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [minPricePerSqm, setMinPricePerSqm] = useState<number | ''>('');
    const [maxPricePerSqm, setMaxPricePerSqm] = useState<number | ''>('');
    
    // Property details
    const [type, setType] = useState('All');
    const [bathrooms, setBathrooms] = useState('All');
    const [areaType, setAreaType] = useState('All');
    const [condition, setCondition] = useState('All');
    const [minYear, setMinYear] = useState<number | ''>('');
    const [maxYear, setMaxYear] = useState<number | ''>('');
    const [energyLabel, setEnergyLabel] = useState('All');
    const [outdoorSpace, setOutdoorSpace] = useState('All');
    
    // Amenities
    const [amenities, setAmenities] = useState<string[]>([]);

    const [sortBy, setSortBy] = useState<SortType>('yield-desc');

    const regionsByCountry: Record<string, string[]> = {
        'All': ['All'],
        'Portugal': ['All', 'Lisbon', 'Porto', 'Braga', 'Faro'],
        'Spain': ['All', 'Valencia', 'Alicante', 'Málaga', 'Las Palmas (Gran Canaria)'],
        'Greece': ['All']
    };

    const [debouncedFilters, setDebouncedFilters] = useState<any>({ page: 1, limit: 100 });

    useEffect(() => {
        const timer = setTimeout(() => {
            const filters: any = { page: 1, limit: 100 };
            if (search) filters.search = search;
            if (country !== 'All') filters.country = country;
            if (city !== 'All') filters.city = city;
            if (minPrice !== '') filters.minPrice = minPrice;
            if (maxPrice !== '') filters.maxPrice = maxPrice;
            if (type !== 'All') filters.type = type;
            if (bathrooms !== 'All') filters.bathrooms = bathrooms;
            if (condition !== 'All') filters.condition = condition;
            if (minYear !== '') filters.minYear = minYear;
            if (maxYear !== '') filters.maxYear = maxYear;
            if (energyLabel !== 'All') filters.energyLabel = energyLabel;
            if (outdoorSpace !== 'All') filters.outdoorSpace = outdoorSpace;
            if (amenities.length > 0) filters.amenities = amenities.join(',');
            
            // Handle Sorting
            if (sortBy) {
                const [sortField, sortOrder] = sortBy.split('-');
                filters.sortBy = sortField;
                filters.sortOrder = sortOrder;
            }

            setDebouncedFilters(filters);
        }, 300);
        return () => clearTimeout(timer);
    }, [search, country, city, minPrice, maxPrice, type, bathrooms, condition, minYear, maxYear, energyLabel, outdoorSpace, amenities, sortBy]);

    const { data: propertiesData, isLoading: loading, isFetching } = useGetPropertiesQuery(debouncedFilters);
    const [toggleSave] = useToggleSavePropertyMutation();

    const handleToggleSave = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth.isAuthenticated) {
            Swal.fire({
                title: 'Login Required',
                text: 'Please sign in to save properties to your dashboard.',
                icon: 'info',
                confirmButtonColor: '#34495E',
                confirmButtonText: 'Login Now'
            });
            return;
        }

        try {
            await toggleSave(id).unwrap();
        } catch (error) {
            Swal.fire('Error', 'Failed to update save status', 'error');
        }
    };

    const properties = propertiesData?.data || [];

    const filteredProperties = useMemo(() => {
        return (properties as any[])
            .filter(p => {
                // We handle pricePerSqm on the frontend since it's a derived field not easily queried via Prisma where clause.
                const pricePerSqm = p.sqm > 0 ? p.price / p.sqm : 0;
                const matchesPricePerSqm = (minPricePerSqm === '' || pricePerSqm >= minPricePerSqm) && (maxPricePerSqm === '' || pricePerSqm <= maxPricePerSqm);
                return matchesPricePerSqm;
            });
    }, [properties, minPricePerSqm, maxPricePerSqm]);

    const activeFilterCount = [
        country !== 'All',
        city !== 'All',
        minPrice !== '',
        maxPrice !== '',
        minPricePerSqm !== '',
        maxPricePerSqm !== '',
        type !== 'All',
        bathrooms !== 'All',
        condition !== 'All',
        minYear !== '',
        maxYear !== '',
        energyLabel !== 'All',
        outdoorSpace !== 'All',
        ...amenities
    ].filter(Boolean).length;

    const toggleAmenity = (amenity: string) => {
        setAmenities(prev => 
            prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
        );
    };

    const clearAllFilters = () => {
        setSearch('');
        setCountry('All');
        setCity('All');
        setMinPrice('');
        setMaxPrice('');
        setMinPricePerSqm('');
        setMaxPricePerSqm('');
        setType('All');
        setBathrooms('All');
        setAreaType('All');
        setCondition('All');
        setMinYear('');
        setMaxYear('');
        setEnergyLabel('All');
        setOutdoorSpace('All');
        setAmenities([]);
    };

    return (
        <div className="max-w-[1440px] mx-auto px-6 pt-32 pb-24 font-montserrat bg-[#fcfbfa] min-h-screen">
            <div className="grid lg:grid-cols-[320px_1fr] gap-8">

                {/* Sidebar: Filters */}
                <aside className="w-full">
                    <div className="sticky top-24 bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-[#2C3E50] rounded-lg">
                                    <Filter className="size-4 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-[#2C3E50]">Filters</h3>
                            </div>
                            <button onClick={clearAllFilters} className="text-xs font-semibold text-[#2C3E50] underline hover:text-[#D4A373]">Clear all</button>
                        </div>
                        
                        {activeFilterCount > 0 && (
                            <div className="flex items-center gap-2 text-sm font-semibold text-[#2C3E50]">
                                Active filters <span className="flex items-center justify-center bg-[#fdf3e7] text-[#D4A373] w-5 h-5 rounded-full text-xs">{activeFilterCount}</span>
                            </div>
                        )}

                        <div className="space-y-6 h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
                            
                            {/* Location Section */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-[#2C3E50]">Location</h4>
                                
                                <div className="space-y-1">
                                    <label className="text-xs text-stone-500">Country</label>
                                    <select
                                        value={country}
                                        onChange={(e) => {
                                            setCountry(e.target.value);
                                            setCity('All');
                                        }}
                                        className="w-full bg-white border border-stone-200 rounded-lg py-2.5 px-3 text-sm font-medium text-[#2C3E50] focus:ring-1 focus:ring-[#D4A373] outline-none"
                                    >
                                        <option value="All">All Countries</option>
                                        <option value="Portugal">🇵🇹 Portugal</option>
                                        <option value="Spain">🇪🇸 Spain</option>
                                        <option value="Greece">🇬🇷 Greece</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-stone-500">City / Region / District</label>
                                    <select
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full bg-white border border-stone-200 rounded-lg py-2.5 px-3 text-sm font-medium text-[#2C3E50] focus:ring-1 focus:ring-[#D4A373] outline-none disabled:bg-stone-50 disabled:text-stone-400"
                                        disabled={country === 'All'}
                                    >
                                        <option value="All">Select location</option>
                                        {regionsByCountry[country]?.filter(c => c !== 'All').map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <hr className="border-stone-100" />

                            {/* Price Section */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-[#2C3E50]">Price</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-semibold">€</span>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                                            className="w-full bg-white border border-stone-200 rounded-lg py-2.5 pl-6 pr-3 text-sm font-medium text-[#2C3E50] focus:ring-1 focus:ring-[#D4A373] outline-none"
                                        />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-semibold">€</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                                            className="w-full bg-white border border-stone-200 rounded-lg py-2.5 pl-6 pr-3 text-sm font-medium text-[#2C3E50] focus:ring-1 focus:ring-[#D4A373] outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-stone-100" />

                            {/* Price per m2 Section */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-[#2C3E50]">Price per m²</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="Min. €"
                                            value={minPricePerSqm}
                                            onChange={(e) => setMinPricePerSqm(e.target.value ? Number(e.target.value) : '')}
                                            className="w-full bg-white border border-stone-200 rounded-lg py-2.5 px-3 text-sm font-medium text-[#2C3E50] focus:ring-1 focus:ring-[#D4A373] outline-none"
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="Max. €"
                                            value={maxPricePerSqm}
                                            onChange={(e) => setMaxPricePerSqm(e.target.value ? Number(e.target.value) : '')}
                                            className="w-full bg-white border border-stone-200 rounded-lg py-2.5 px-3 text-sm font-medium text-[#2C3E50] focus:ring-1 focus:ring-[#D4A373] outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-stone-100" />

                            {/* Property details Section */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-[#2C3E50]">Property details</h4>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs text-stone-500">Property Type</label>
                                        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-white border border-stone-200 rounded-lg py-2 px-2 text-xs font-medium text-[#2C3E50] outline-none">
                                            <option value="All">Any</option>
                                            <option value="Apartment">Apartment</option>
                                            <option value="Studio">Studio</option>
                                            <option value="Villa">Villa</option>
                                            <option value="Penthouse">Penthouse</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-stone-500">Bathrooms</label>
                                        <select value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="w-full bg-white border border-stone-200 rounded-lg py-2 px-2 text-xs font-medium text-[#2C3E50] outline-none">
                                            <option value="All">Any</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5+">5+</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs text-stone-500">Area Type</label>
                                        <select value={areaType} onChange={(e) => setAreaType(e.target.value)} className="w-full bg-white border border-stone-200 rounded-lg py-2 px-2 text-xs font-medium text-[#2C3E50] outline-none">
                                            <option value="All">Any</option>
                                            <option value="Sqm">Sqm</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-stone-500">Property Condition</label>
                                        <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full bg-white border border-stone-200 rounded-lg py-2 px-2 text-xs font-medium text-[#2C3E50] outline-none">
                                            <option value="All">Any</option>
                                            <option value="New Build">New Build</option>
                                            <option value="Under Construction">Under Construction</option>
                                            <option value="Good">Good</option>
                                            <option value="Renovated">Renovated</option>
                                            <option value="Needs Renovation">Needs Renovation</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-stone-500">Year Built</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="number"
                                            placeholder="Min. year"
                                            value={minYear}
                                            onChange={(e) => setMinYear(e.target.value ? Number(e.target.value) : '')}
                                            className="w-full bg-white border border-stone-200 rounded-lg py-2 px-2 text-xs font-medium text-[#2C3E50] outline-none"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max. year"
                                            value={maxYear}
                                            onChange={(e) => setMaxYear(e.target.value ? Number(e.target.value) : '')}
                                            className="w-full bg-white border border-stone-200 rounded-lg py-2 px-2 text-xs font-medium text-[#2C3E50] outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs text-stone-500">Energy Label</label>
                                        <select value={energyLabel} onChange={(e) => setEnergyLabel(e.target.value)} className="w-full bg-white border border-stone-200 rounded-lg py-2 px-2 text-xs font-medium text-[#2C3E50] outline-none">
                                            <option value="All">Any</option>
                                            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-stone-500">Outdoor Space</label>
                                        <select value={outdoorSpace} onChange={(e) => setOutdoorSpace(e.target.value)} className="w-full bg-white border border-stone-200 rounded-lg py-2 px-2 text-xs font-medium text-[#2C3E50] outline-none">
                                            <option value="All">Any</option>
                                            <option value="Balcony">Balcony</option>
                                            <option value="Terrace">Terrace</option>
                                            <option value="Garden">Garden</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-stone-100" />

                            {/* Amenities Section */}
                            <div className="space-y-4 pb-4">
                                <h4 className="text-sm font-bold text-[#2C3E50]">Amenities</h4>
                                
                                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                                    {['Parking', 'Elevator', 'Air Conditioning', 'Swimming Pool', 'Garage', 'Gym', 'Security', 'Sea View'].map(amenity => (
                                        <label key={amenity} onClick={() => toggleAmenity(amenity)} className="flex items-center gap-2 cursor-pointer group">
                                            <div className={cn(
                                                "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                                amenities.includes(amenity) ? "bg-[#2C3E50] border-[#2C3E50]" : "border-stone-300 bg-white group-hover:border-[#2C3E50]"
                                            )}>
                                                {amenities.includes(amenity) && <Check className="size-3 text-white" />}
                                            </div>
                                            <span className="text-xs text-stone-600 font-medium select-none">{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Footer Actions */}
                        <div className="pt-4 border-t border-stone-100 flex gap-3">
                            <button className="flex-1 py-3 px-4 bg-white border border-stone-200 rounded-xl text-sm font-bold text-[#2C3E50] hover:bg-stone-50 transition-colors flex items-center justify-center gap-2">
                                <Lock className="size-4" /> Save search
                            </button>
                            <button className="flex-[1.5] py-3 px-4 bg-[#2C3E50] rounded-xl text-sm font-bold text-white hover:bg-[#1a252f] transition-colors">
                                Show {filteredProperties.length} properties
                            </button>
                        </div>

                    </div>
                </aside>

                {/* Main Content: Properties Grid */}
                <div className="space-y-8 w-full">
                    {/* Search and Sort Toolbar */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-grow max-w-xl w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Search by location, project or district..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white border border-stone-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-[#2C3E50] focus:ring-1 focus:ring-[#D4A373] outline-none shadow-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-white rounded-xl border border-stone-100 shadow-sm px-3 py-1.5">
                            <span className="text-xs font-semibold text-stone-400">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortType)}
                                className="bg-transparent border-none text-sm font-bold text-[#2C3E50] outline-none cursor-pointer py-1 pr-2"
                            >
                                <option value="yield-desc">Highest Yield</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="appreciation-desc">Highest Appreciation</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Metrics row (matching the image) */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                            <div className="text-xl font-black text-[#2C3E50]">{filteredProperties.length}</div>
                            <div className="text-xs font-medium text-stone-500">Properties found</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                            <div className="text-xl font-black text-[#2C3E50]">
                                {filteredProperties.length > 0 ? (filteredProperties.reduce((acc, p) => acc + (p.yield || 0), 0) / filteredProperties.length).toFixed(1) : 0}%
                            </div>
                            <div className="text-xs font-medium text-stone-500">Avg. Gross Yield</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                            <div className="text-xl font-black text-[#2C3E50]">
                                €{filteredProperties.length > 0 ? Math.round(filteredProperties.reduce((acc, p) => acc + Math.round(((p.yield||0) * p.price) / 1200), 0) / filteredProperties.length).toLocaleString() : 0}
                            </div>
                            <div className="text-xs font-medium text-stone-500">Avg. Rental Estimate /mo</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                            <div className="text-xl font-black text-[#2C3E50]">
                                €{filteredProperties.length > 0 ? Math.round(filteredProperties.reduce((acc, p) => acc + p.price, 0) / filteredProperties.length).toLocaleString() : 0}
                            </div>
                            <div className="text-xs font-medium text-stone-500">Avg. Price</div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <div key={i} className="h-[400px] bg-stone-100 rounded-[24px] animate-pulse" />
                            ))
                        ) : filteredProperties.length > 0 ? (
                            filteredProperties.map((property) => (
                                <motion.div
                                    key={property.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="group bg-white rounded-[24px] overflow-hidden border border-stone-100 hover:border-[#D4A373]/30 hover:shadow-xl transition-all duration-300 relative flex flex-col"
                                >
                                    <div className="relative h-48 m-2 rounded-[16px] overflow-hidden bg-stone-100">
                                        {property.image ? (
                                            <Image
                                                src={property.image}
                                                alt={property.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover transition-transform group-hover:scale-105 duration-700"
                                            />
                                        ) : (
                                            <div className="size-full flex items-center justify-center bg-stone-50">
                                                <Building2 className="size-8 text-stone-200" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span className="px-3 py-1.5 bg-[#D4A373] text-white rounded-lg text-[10px] font-black shadow-sm uppercase tracking-wider">
                                                {property.yield}% Gross Yield
                                            </span>
                                        </div>

                                        {/* Save Property Button */}
                                        <button
                                            onClick={(e) => handleToggleSave(property.id, e)}
                                            className={cn(
                                                "absolute top-3 right-3 size-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-all duration-300 group/heart",
                                                auth?.isAuthenticated ? "hover:bg-white text-stone-300" : "opacity-50 cursor-not-allowed text-stone-400",
                                                property.isSaved && "text-red-500"
                                            )}
                                        >
                                            <Heart className={cn("size-4 transition-transform group-hover/heart:scale-110", property.isSaved && "fill-current")} />
                                        </button>
                                    </div>

                                    <div className="p-4 space-y-3 flex-grow flex flex-col">
                                        <div>
                                            <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">{property.location}</div>
                                            <Link href={`/properties/${property.id}`}>
                                                <h3 className="text-base font-black text-[#2C3E50] group-hover:text-[#D4A373] transition-colors leading-tight line-clamp-1">{property.title}</h3>
                                            </Link>
                                        </div>

                                        <div className="flex flex-wrap gap-2 pt-1">
                                            <div className="px-2 py-1 bg-stone-50 rounded text-[9px] font-bold text-stone-500 uppercase">{property.bedrooms === 0 ? 'Studio' : (property.bedrooms + ' Bed')}</div>
                                            <div className="px-2 py-1 bg-stone-50 rounded text-[9px] font-bold text-stone-500 uppercase">{property.sqm} Sqm</div>
                                            {property.condition && <div className="px-2 py-1 bg-stone-50 rounded text-[9px] font-bold text-stone-500 uppercase line-clamp-1 max-w-[80px]">{property.condition}</div>}
                                            {property.features?.includes('Pool') && <div className="px-2 py-1 bg-stone-50 rounded text-[9px] font-bold text-stone-500 uppercase">Pool</div>}
                                        </div>

                                        <div className="mt-auto pt-4 flex items-end justify-between border-t border-stone-50">
                                            <div>
                                                <span className="text-[9px] font-bold text-stone-400 block mb-0.5">Asking Price</span>
                                                <div className="text-lg font-black text-[#2C3E50]">€{property.price.toLocaleString()}</div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[9px] font-bold text-stone-400 block mb-0.5">Rental Estimate</span>
                                                <div className="text-sm font-black text-[#D4A373]">€{Math.round((property.yield * property.price) / 1200).toLocaleString()}/mo</div>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/properties/${property.id}`}
                                            className="w-full mt-3 py-2.5 bg-[#2C3E50] text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#1a252f] transition-all"
                                        >
                                            View details <ArrowRight className="size-3" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center font-bold text-stone-400 uppercase tracking-widest text-sm">No properties match your filters</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
