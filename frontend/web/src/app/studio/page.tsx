'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Download,
    Type,
    Palette,
    Sparkles,
    Sliders,
    Maximize2,
    Save,
    Sticker,
    Filter,
    Frame,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Italic,
    Underline,
    RotateCw,
    Copy,
    Eye,
    EyeOff
} from 'lucide-react';
import { downloadAsImage } from '@/lib/utils';
import { quotesApi } from '@/lib/api';

// Solid colors with hex values
const SOLID_COLORS = [
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Gray', value: '#6b7280' },
];

// Gradient backgrounds
const GRADIENT_BACKGROUNDS = [
    { name: 'Purple-Indigo', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Pink-Rose', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Cyan-Blue', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: 'Emerald-Teal', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { name: 'Orange-Red', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { name: 'Sunset', value: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)' },
    { name: 'Ocean', value: 'linear-gradient(135deg, #2e3192 0%, #1bffff 100%)' },
    { name: 'Fire', value: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)' },
];

const DEFAULT_FONTS = [
    // Google Fonts - Popular Bangla
    { name: 'Hind Siliguri', value: 'var(--font-hind-siliguri)' },
    { name: 'Noto Sans Bengali', value: 'var(--font-noto-sans-bengali)' },
    { name: 'Tiro Bangla', value: 'var(--font-tiro-bangla)' },
    { name: 'Baloo Da 2', value: 'var(--font-baloo-da)' },
    { name: 'Galada', value: 'var(--font-galada)' },
    { name: 'Atma', value: 'var(--font-atma)' },
    { name: 'Mukta', value: 'var(--font-mukta)' },
    { name: 'Anek Bangla', value: 'var(--font-anek-bangla)' },
    { name: 'Mina', value: 'var(--font-mina)' },
    { name: 'Sura', value: 'var(--font-sura)' },
    { name: 'Tillana', value: 'var(--font-tillana)' },
    { name: 'Laila', value: 'var(--font-laila)' },

    // System Fonts
    { name: 'Kalpurush', value: 'Kalpurush, sans-serif' },
    { name: 'SolaimanLipi', value: 'SolaimanLipi, sans-serif' },
    { name: 'Nikosh', value: 'Nikosh, sans-serif' },
    { name: 'Siyam Rupali', value: 'Siyam Rupali, sans-serif' },

    // English Fallbacks
    { name: 'Poppins', value: 'var(--font-poppins)' },
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Serif', value: 'Georgia, serif' },
    { name: 'Monospace', value: 'Courier New, monospace' },
];

const CANVAS_SIZES = [
    { name: 'Square', width: 500, height: 500, label: 'Instagram (1:1)' },
    { name: 'Story', width: 400, height: 711, label: 'Story (9:16)' },
    { name: 'Landscape', width: 640, height: 360, label: 'YouTube (16:9)' },
    { name: 'Facebook', width: 600, height: 314, label: 'Facebook (1.91:1)' },
    { name: 'Twitter', width: 600, height: 300, label: 'Twitter (2:1)' },
    { name: 'Custom', width: 800, height: 600, label: 'Custom Size' },
];

const FILTERS = [
    { name: 'None', value: 'none' },
    { name: 'Grayscale', value: 'grayscale(100%)' },
    { name: 'Sepia', value: 'sepia(100%)' },
    { name: 'Blur', value: 'blur(2px)' },
    { name: 'Brightness', value: 'brightness(1.2)' },
    { name: 'Contrast', value: 'contrast(1.3)' },
    { name: 'Vintage', value: 'sepia(50%) contrast(1.2) brightness(0.9)' },
    { name: 'Cool', value: 'hue-rotate(90deg) saturate(1.5)' },
];

const STICKERS = ['❤️', '⭐', '✨', '🌟', '💫', '🎯', '🔥', '💡', '📚', '✍️', '🌸', '🌺', '🎨', '💬', '🌈', '☀️'];

export default function StudioPage() {
    const [text, setText] = useState('এখানে আপনার উক্তি লিখুন...');
    const [author, setAuthor] = useState('লেখকের নাম');
    const [subtitle, setSubtitle] = useState('');
    const [bgType, setBgType] = useState<'solid' | 'gradient' | 'image'>('gradient');
    const [bgColor, setBgColor] = useState('#667eea');
    const [bgGradient, setBgGradient] = useState(GRADIENT_BACKGROUNDS[0].value);
    const [bgImage] = useState<string | null>(null);
    const [customBgColor, setCustomBgColor] = useState('#667eea');
    const [fontSize, setFontSize] = useState(24);
    const [textColor, setTextColor] = useState('#ffffff');
    const [fontFamily, setFontFamily] = useState(DEFAULT_FONTS[0].value);
    const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
    const [canvasSize, setCanvasSize] = useState(CANVAS_SIZES[0]);
    const [customWidth, setCustomWidth] = useState(800);
    const [customHeight, setCustomHeight] = useState(600);
    const [textShadow, setTextShadow] = useState(true);
    const [textOutline, setTextOutline] = useState(false);
    const [bgOpacity, setBgOpacity] = useState(100);
    const [bgBlur, setBgBlur] = useState(0);
    const [filter, setFilter] = useState('none');
    const [borderStyle, setBorderStyle] = useState('none');
    const [borderWidth, setBorderWidth] = useState(0);
    const [borderColor, setBorderColor] = useState('#ffffff');
    const [borderRadius, setBorderRadius] = useState(12);
    const [padding, setPadding] = useState(48);
    const [selectedSticker, setSelectedSticker] = useState('');
    const [stickerSize, setStickerSize] = useState(40);
    const [stickerPosition, setStickerPosition] = useState({ x: 50, y: 20 });
    const [watermarkVisible, setWatermarkVisible] = useState(true);
    const [watermarkPosition, setWatermarkPosition] = useState<'bottom-left' | 'bottom-center' | 'bottom-right'>('bottom-center');
    const [fontWeight, setFontWeight] = useState(400);
    const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>('normal');
    const [textDecoration, setTextDecoration] = useState<'none' | 'underline'>('none');
    const [lineHeight, setLineHeight] = useState(1.6);
    const [letterSpacing, setLetterSpacing] = useState(0);
    const [textTransform] = useState<'none' | 'uppercase' | 'lowercase' | 'capitalize'>('none');
    const [rotation, setRotation] = useState(0);
    const [authorSize, setAuthorSize] = useState(16);
    const [showAuthor, setShowAuthor] = useState(true);


    const previewRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'effects' | 'templates'>('basic');


    const handleRandomQuote = async () => {
        try {
            const res = await quotesApi.getRandom();
            if (res.data?.data) {
                setText(res.data.data.textBn);
                setAuthor(res.data.data.author || 'অজানা');
            }
        } catch (error) {
            console.error('Failed to fetch random quote');
        }
    };

    const handleDownload = async () => {
        if (!previewRef.current) return;
        setIsDownloading(true);
        try {
            await downloadAsImage(previewRef.current, `bangla-quote-${Date.now()}.png`);
        } catch (e) {
            console.error(e);
        }
        setIsDownloading(false);
    };

    const saveDraft = () => {
        const draft = { text, author, subtitle, bgType, bgColor, bgGradient, fontSize, textColor };
        localStorage.setItem('studio-draft', JSON.stringify(draft));
        alert('Draft saved! ✅');
    };

    const loadDraft = () => {
        const saved = localStorage.getItem('studio-draft');
        if (saved) {
            const draft = JSON.parse(saved);
            setText(draft.text || text);
            setAuthor(draft.author || author);
            setSubtitle(draft.subtitle || '');
            setBgType(draft.bgType || 'gradient');
            setBgColor(draft.bgColor || bgColor);
            setBgGradient(draft.bgGradient || bgGradient);
            setFontSize(draft.fontSize || fontSize);
            setTextColor(draft.textColor || textColor);
        }
    };

    useEffect(() => {
        loadDraft();
    }, []);

    const getBackgroundStyle = () => {
        if (bgType === 'solid') return { backgroundColor: bgColor };
        if (bgType === 'gradient') return { background: bgGradient };
        if (bgType === 'image' && bgImage) return { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
        return { background: bgGradient };
    };

    const getTextShadowStyle = () => {
        if (textShadow) return '2px 2px 8px rgba(0,0,0,0.6)';
        return 'none';
    };

    const getTextOutlineStyle = () => {
        if (textOutline) return { WebkitTextStroke: '1px rgba(0,0,0,0.5)' };
        return {};
    };

    const getWatermarkClass = () => {
        if (watermarkPosition === 'bottom-left') return 'left-4';
        if (watermarkPosition === 'bottom-right') return 'right-4';
        return 'left-1/2 -translate-x-1/2';
    };

    const currentWidth = canvasSize.name === 'Custom' ? customWidth : canvasSize.width;
    const currentHeight = canvasSize.name === 'Custom' ? customHeight : canvasSize.height;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 min-h-[calc(100vh-64px)]">

                {/* Preview Area */}
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-200 rounded-2xl p-8">
                    {/* Toolbar */}
                    <div className="mb-4 flex gap-2 bg-white rounded-lg p-2 shadow-sm">
                        <button onClick={saveDraft} className="p-2 hover:bg-gray-100 rounded" title="Save Draft">
                            <Save className="w-4 h-4" />
                        </button>
                        <button onClick={() => navigator.clipboard.writeText(text)} className="p-2 hover:bg-gray-100 rounded" title="Copy Text">
                            <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={() => setRotation(rotation + 90)} className="p-2 hover:bg-gray-100 rounded" title="Rotate">
                            <RotateCw className="w-4 h-4" />
                        </button>
                        <button onClick={() => setWatermarkVisible(!watermarkVisible)} className="p-2 hover:bg-gray-100 rounded" title="Toggle Watermark">
                            {watermarkVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Canvas */}
                    <div
                        ref={previewRef}
                        className="shadow-2xl flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden"
                        style={{
                            width: `${currentWidth}px`,
                            height: `${currentHeight}px`,
                            ...getBackgroundStyle(),
                            padding: `${padding}px`,
                            borderStyle: borderStyle !== 'none' ? borderStyle : undefined,
                            borderWidth: borderStyle !== 'none' ? `${borderWidth}px` : undefined,
                            borderColor: borderStyle !== 'none' ? borderColor : undefined,
                            borderRadius: `${borderRadius}px`,
                            transform: `rotate(${rotation}deg)`,
                            filter: filter !== 'none' ? filter : undefined,
                        }}
                    >
                        {bgImage && bgType === 'image' && (
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundColor: `rgba(0,0,0,${(100 - bgOpacity) / 100})`,
                                    backdropFilter: bgBlur > 0 ? `blur(${bgBlur}px)` : 'none',
                                }}
                            />
                        )}

                        <div className="relative z-10 flex flex-col items-center justify-center h-full" style={{ textAlign }}>
                            <p
                                style={{
                                    fontSize: `${fontSize}px`,
                                    color: textColor,
                                    fontFamily,
                                    textShadow: getTextShadowStyle(),
                                    fontWeight,
                                    fontStyle,
                                    textDecoration,
                                    lineHeight,
                                    letterSpacing: `${letterSpacing}px`,
                                    textTransform,
                                    ...getTextOutlineStyle(),
                                }}
                                className="leading-relaxed whitespace-pre-wrap mb-6"
                            >
                                {text}
                            </p>

                            {subtitle && (
                                <p className="text-sm mb-4 opacity-80" style={{ color: textColor, textShadow: getTextShadowStyle() }}>
                                    {subtitle}
                                </p>
                            )}

                            {showAuthor && (
                                <p
                                    className="font-medium opacity-80"
                                    style={{
                                        fontSize: `${authorSize}px`,
                                        color: textColor,
                                        textShadow: getTextShadowStyle(),
                                    }}
                                >
                                    - {author}
                                </p>
                            )}

                            {selectedSticker && (
                                <div
                                    className="absolute"
                                    style={{
                                        fontSize: `${stickerSize}px`,
                                        top: `${stickerPosition.y}%`,
                                        left: `${stickerPosition.x}%`,
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                >
                                    {selectedSticker}
                                </div>
                            )}
                        </div>

                        {watermarkVisible && (
                            <div className={`absolute bottom-4 ${getWatermarkClass()} opacity-50 text-[10px]`} style={{ color: textColor }}>
                                banglaquotes.com
                            </div>
                        )}
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                        {canvasSize.label} - {currentWidth}×{currentHeight}px
                    </div>
                </div>

                {/* Controls Sidebar */}
                <div className="w-full md:w-96 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col max-h-[calc(100vh-120px)]">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        {[
                            { id: 'basic', label: 'Basic', icon: Type },
                            { id: 'advanced', label: 'Advanced', icon: Sliders },
                            { id: 'effects', label: 'Effects', icon: Filter },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 py-3 px-2 text-xs font-medium flex items-center justify-center gap-1 ${activeTab === tab.id ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === 'basic' && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-700">উক্তি</label>
                                        <button onClick={handleRandomQuote} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> র‍্যান্ডম
                                        </button>
                                    </div>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 min-h-[100px]"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-700">লেখক</label>
                                        <button onClick={() => setShowAuthor(!showAuthor)} className="text-xs text-gray-500">
                                            {showAuthor ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                    {showAuthor && (
                                        <div className="flex gap-2 items-center">
                                            <input type="range" min="10" max="32" value={authorSize} onChange={(e) => setAuthorSize(Number(e.target.value))} className="flex-1" />
                                            <span className="text-xs text-gray-500 w-8">{authorSize}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">সাবটাইটেল</label>
                                    <input
                                        type="text"
                                        value={subtitle}
                                        onChange={(e) => setSubtitle(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="#হ্যাশট্যাগ"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Type className="w-4 h-4" /> Typography
                                    </label>

                                    <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full p-2 border rounded-lg text-sm">
                                        {DEFAULT_FONTS.map((font, idx) => (
                                            <option key={idx} value={font.value}>{font.name}</option>
                                        ))}
                                    </select>

                                    <div className="flex gap-2">
                                        <input type="range" min="16" max="72" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="flex-1" />
                                        <span className="text-sm text-gray-500 w-8">{fontSize}</span>
                                    </div>

                                    <select value={fontWeight} onChange={(e) => setFontWeight(Number(e.target.value))} className="w-full p-2 border rounded-lg text-sm">
                                        <option value={300}>Light</option>
                                        <option value={400}>Regular</option>
                                        <option value={600}>Semi Bold</option>
                                        <option value={700}>Bold</option>
                                    </select>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic')}
                                            className={`p-2 border rounded ${fontStyle === 'italic' ? 'bg-primary-50 border-primary-500' : 'border-gray-200'}`}
                                        >
                                            <Italic className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setTextDecoration(textDecoration === 'underline' ? 'none' : 'underline')}
                                            className={`p-2 border rounded ${textDecoration === 'underline' ? 'bg-primary-50 border-primary-500' : 'border-gray-200'}`}
                                        >
                                            <Underline className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-600">Line Height</label>
                                        <div className="flex gap-2">
                                            <input type="range" min="1" max="2.5" step="0.1" value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} className="flex-1" />
                                            <span className="text-sm text-gray-500 w-8">{lineHeight.toFixed(1)}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-600">Letter Spacing</label>
                                        <div className="flex gap-2">
                                            <input type="range" min="-2" max="10" value={letterSpacing} onChange={(e) => setLetterSpacing(Number(e.target.value))} className="flex-1" />
                                            <span className="text-sm text-gray-500 w-8">{letterSpacing}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {['left', 'center', 'right'].map((align) => (
                                            <button
                                                key={align}
                                                onClick={() => setTextAlign(align as any)}
                                                className={`flex-1 p-2 border rounded ${textAlign === align ? 'bg-primary-50 border-primary-500' : 'border-gray-200'}`}
                                            >
                                                {align === 'left' ? <AlignLeft className="w-4 h-4 mx-auto" /> : align === 'center' ? <AlignCenter className="w-4 h-4 mx-auto" /> : <AlignRight className="w-4 h-4 mx-auto" />}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex gap-2 items-center">
                                        <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-10 w-10 rounded cursor-pointer" />
                                        <span className="text-sm text-gray-500">Text Color</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Palette className="w-4 h-4" /> Background
                                    </label>

                                    <div className="flex gap-2">
                                        {['solid', 'gradient'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setBgType(type as any)}
                                                className={`flex-1 p-2 border rounded text-xs ${bgType === type ? 'bg-primary-50 border-primary-500' : 'border-gray-200'}`}
                                            >
                                                {type === 'solid' ? 'Solid' : 'Gradient'}
                                            </button>
                                        ))}
                                    </div>

                                    {bgType === 'solid' && (
                                        <div className="grid grid-cols-6 gap-2">
                                            {SOLID_COLORS.map((color) => (
                                                <button
                                                    key={color.value}
                                                    onClick={() => setBgColor(color.value)}
                                                    className={`aspect-square rounded-lg border-2 ${bgColor === color.value ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'}`}
                                                    style={{ backgroundColor: color.value }}
                                                    title={color.name}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {bgType === 'gradient' && (
                                        <div className="grid grid-cols-4 gap-2">
                                            {GRADIENT_BACKGROUNDS.map((grad) => (
                                                <button
                                                    key={grad.name}
                                                    onClick={() => setBgGradient(grad.value)}
                                                    className={`aspect-square rounded-lg border-2 ${bgGradient === grad.value ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'}`}
                                                    style={{ background: grad.value }}
                                                    title={grad.name}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-2 items-center">
                                        <input type="color" value={customBgColor} onChange={(e) => { setCustomBgColor(e.target.value); setBgColor(e.target.value); setBgType('solid'); }} className="h-10 w-10 rounded cursor-pointer" />
                                        <span className="text-sm text-gray-500">Custom Color</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'advanced' && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Maximize2 className="w-4 h-4" /> Canvas Size
                                    </label>
                                    <select
                                        value={CANVAS_SIZES.findIndex((s) => s.name === canvasSize.name)}
                                        onChange={(e) => setCanvasSize(CANVAS_SIZES[Number(e.target.value)])}
                                        className="w-full p-2 border rounded-lg text-sm"
                                    >
                                        {CANVAS_SIZES.map((size, idx) => (
                                            <option key={idx} value={idx}>{size.label}</option>
                                        ))}
                                    </select>
                                    {canvasSize.name === 'Custom' && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <input type="number" value={customWidth} onChange={(e) => setCustomWidth(Number(e.target.value))} className="p-2 border rounded text-sm" placeholder="Width" />
                                            <input type="number" value={customHeight} onChange={(e) => setCustomHeight(Number(e.target.value))} className="p-2 border rounded text-sm" placeholder="Height" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">Padding</label>
                                    <div className="flex gap-2">
                                        <input type="range" min="0" max="100" value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="flex-1" />
                                        <span className="text-sm text-gray-500 w-12">{padding}px</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">Border Radius</label>
                                    <div className="flex gap-2">
                                        <input type="range" min="0" max="50" value={borderRadius} onChange={(e) => setBorderRadius(Number(e.target.value))} className="flex-1" />
                                        <span className="text-sm text-gray-500 w-12">{borderRadius}px</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Frame className="w-4 h-4" /> Border
                                    </label>
                                    <select value={borderStyle} onChange={(e) => setBorderStyle(e.target.value)} className="w-full p-2 border rounded-lg text-sm">
                                        <option value="none">None</option>
                                        <option value="solid">Solid</option>
                                        <option value="dashed">Dashed</option>
                                        <option value="dotted">Dotted</option>
                                    </select>
                                    {borderStyle !== 'none' && (
                                        <>
                                            <div className="flex gap-2">
                                                <input type="range" min="1" max="20" value={borderWidth} onChange={(e) => setBorderWidth(Number(e.target.value))} className="flex-1" />
                                                <span className="text-sm text-gray-500 w-12">{borderWidth}px</span>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="h-10 w-10 rounded cursor-pointer" />
                                                <span className="text-sm text-gray-500">Border Color</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">Rotation</label>
                                    <div className="flex gap-2">
                                        <input type="range" min="0" max="360" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="flex-1" />
                                        <span className="text-sm text-gray-500 w-12">{rotation}°</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Sticker className="w-4 h-4" /> Stickers
                                    </label>
                                    <div className="grid grid-cols-8 gap-2">
                                        {STICKERS.map((sticker, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedSticker(selectedSticker === sticker ? '' : sticker)}
                                                className={`aspect-square text-xl rounded-lg border-2 ${selectedSticker === sticker ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}
                                            >
                                                {sticker}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedSticker && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-600">Size</label>
                                                <div className="flex gap-2">
                                                    <input type="range" min="20" max="100" value={stickerSize} onChange={(e) => setStickerSize(Number(e.target.value))} className="flex-1" />
                                                    <span className="text-xs text-gray-500 w-8">{stickerSize}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-600">Position X</label>
                                                <input type="range" min="0" max="100" value={stickerPosition.x} onChange={(e) => setStickerPosition({ ...stickerPosition, x: Number(e.target.value) })} className="w-full" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-600">Position Y</label>
                                                <input type="range" min="0" max="100" value={stickerPosition.y} onChange={(e) => setStickerPosition({ ...stickerPosition, y: Number(e.target.value) })} className="w-full" />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">Watermark</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['bottom-left', 'bottom-center', 'bottom-right'].map((pos) => (
                                            <button
                                                key={pos}
                                                onClick={() => setWatermarkPosition(pos as any)}
                                                className={`p-2 border rounded text-xs ${watermarkPosition === pos ? 'bg-primary-50 border-primary-500' : 'border-gray-200'}`}
                                            >
                                                {pos.split('-')[1]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'effects' && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">Text Effects</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setTextShadow(!textShadow)}
                                            className={`flex-1 p-3 border rounded-lg text-sm ${textShadow ? 'bg-primary-50 border-primary-500' : 'border-gray-200'}`}
                                        >
                                            Shadow
                                        </button>
                                        <button
                                            onClick={() => setTextOutline(!textOutline)}
                                            className={`flex-1 p-3 border rounded-lg text-sm ${textOutline ? 'bg-primary-50 border-primary-500' : 'border-gray-200'}`}
                                        >
                                            Outline
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Filter className="w-4 h-4" /> Filters
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {FILTERS.map((f) => (
                                            <button
                                                key={f.name}
                                                onClick={() => setFilter(f.value)}
                                                className={`p-3 border rounded-lg text-sm ${filter === f.value ? 'bg-primary-50 border-primary-500' : 'border-gray-200'}`}
                                            >
                                                {f.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {bgType === 'image' && (
                                    <>
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-gray-700">Background Opacity</label>
                                            <div className="flex gap-2">
                                                <input type="range" min="0" max="100" value={bgOpacity} onChange={(e) => setBgOpacity(Number(e.target.value))} className="flex-1" />
                                                <span className="text-sm text-gray-500 w-12">{bgOpacity}%</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-gray-700">Background Blur</label>
                                            <div className="flex gap-2">
                                                <input type="range" min="0" max="20" value={bgBlur} onChange={(e) => setBgBlur(Number(e.target.value))} className="flex-1" />
                                                <span className="text-sm text-gray-500 w-12">{bgBlur}px</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-gray-200">
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            <Download className="w-5 h-5" />
                            {isDownloading ? 'ডাউনলোড হচ্ছে...' : 'ইমেজ ডাউনলোড করুন'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
