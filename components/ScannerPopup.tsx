import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import {
  FaCamera, 
  FaTimes, 
  FaLeaf, 
  FaThumbsUp, 
  FaThumbsDown,
  FaLightbulb, 
  FaRegLightbulb,
  FaShoppingCart,
  FaHeartbeat,
  FaFireAlt,
  FaSeedling,
  FaWeight,
  FaRecycle,
  FaTree,
  FaPaw
} from "react-icons/fa";
import { MdOutlineScreenSearchDesktop, MdLocalGroceryStore, MdEco } from "react-icons/md";
import { GiMeal, GiFruitBowl, GiPlantSeed } from "react-icons/gi";
import { IoMdNutrition } from "react-icons/io";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useMediaQuery } from "react-responsive";

const GOOGLE_API_KEY = "AIzaSyA50GBvxbs73JECH2FdI2WG6HEE3fFjaCk";

const ScannerPopup = ({ onClose }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [detectedText, setDetectedText] = useState("");
  const [pros, setPros] = useState([]);
  const [cons, setCons] = useState([]);
  const [environmentalImpact, setEnvironmentalImpact] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pros");
  const [scanMode, setScanMode] = useState("product");
  const [error, setError] = useState(null);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: "environment",
    torch: flashOn
  };

  const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

  const toggleFlash = async () => {
    try {
      if (webcamRef.current?.video?.srcObject) {
        const stream = webcamRef.current.video.srcObject;
        const track = stream.getVideoTracks()[0];
        
        if (track.getCapabilities().torch) {
          await track.applyConstraints({
            advanced: [{ torch: !flashOn }]
          });
          setFlashOn(!flashOn);
        } else {
          setError("Flash not supported on this device");
        }
      }
    } catch (err) {
      console.error("Flash error:", err);
      setError("Could not toggle flash");
    }
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setError(null);
    setShowAnalysisPanel(false);
    setNutritionData(null);
  };

  const parseNutritionData = (text) => {
    const result = {
      positives: [],
      negatives: [],
      recommendations: [],
      dailyValues: {
        Cholesterol: 300, 
        'Unsat. Fats': 70, 
        Proteins: 50,   
        Energy: 2000 
      }
    };
    
    const lines = text.split('\n');
    let currentSection = null;
    
    lines.forEach(line => {
      if (line.toLowerCase().includes('negatives')) {
        currentSection = 'negatives';
      } else if (line.toLowerCase().includes('positives')) {
        currentSection = 'positives';
      } else if (currentSection && line.trim()) {
        const [name, value] = line.split(/\s{2,}/);
        if (name && value) {
          const numericValue = parseFloat(value);
          if (!isNaN(numericValue)) {
            result[currentSection].push({
              name: name.trim(),
              value: value.trim(),
              numericValue,
              percentage: Math.min(100, Math.round((numericValue / 
                (result.dailyValues[name.trim()] || 100)) * 100))
            });
          }
        }
      }
    });

    // Generate recommendations
    result.negatives.forEach(item => {
      if (item.name.includes('Cholesterol')) {
        result.recommendations.push({
          text: "Choose plant-based alternatives to reduce cholesterol",
          icon: <FaSeedling className="text-emerald-500" />
        });
      }
      if (item.name.includes('Fats')) {
        result.recommendations.push({
          text: "Look for products with 'unsaturated fats' instead",
          icon: <GiFruitBowl className="text-blue-400" />
        });
      }
      if (item.name.includes('Energy') && item.numericValue > 300) {
        result.recommendations.push({
          text: "Consider smaller portions to manage calorie intake",
          icon: <FaWeight className="text-amber-500" />
        });
      }
    });

    return result;
  };

  const betterProducts = [
    {
      name: "Organic Quinoa Protein",
      description: "High protein, low cholesterol plant-based protein",
      benefits: ["+32g protein", "-0mg cholesterol", "100% plant-based"],
      price: "$12.99",
      link: "https://example.com/quinoa-protein",
      rating: 4.8,
      icon: <GiMeal className="text-amber-500 text-xl" />
    },
    {
      name: "Almond Butter Spread",
      description: "Healthy unsaturated fats with no additives",
      benefits: ["+15g healthy fats", "+7g protein", "No cholesterol"],
      price: "$8.49",
      link: "https://example.com/almond-butter",
      rating: 4.6,
      icon: <GiFruitBowl className="text-amber-300 text-xl" />
    },
    {
      name: "Vegan Protein Bars",
      description: "Complete plant protein with essential amino acids",
      benefits: ["+20g protein", "Low sugar", "High fiber"],
      price: "$24.99 (12-pack)",
      link: "https://example.com/vegan-bars",
      rating: 4.7,
      icon: <MdLocalGroceryStore className="text-emerald-500 text-xl" />
    }
  ];

  const scanImage = async () => {
    if (!capturedImage) return;
    setLoading(true);
    setError(null);
    const base64Img = capturedImage.replace(/^data:image\/(png|jpg);base64,/, "");

    try {
      if (scanMode === "product") {
        const visionResponse = await fetch(
          `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
          {
            method: "POST",
            body: JSON.stringify({
              requests: [{
                image: { content: base64Img },
                features: [{ type: "TEXT_DETECTION", maxResults: 5 }],
              }],
            }),
          }
        );

        if (!visionResponse.ok) throw new Error(`Vision API error: ${visionResponse.status}`);
        const visionData = await visionResponse.json();
        const text = visionData.responses?.[0]?.fullTextAnnotation?.text || "";
        
        if (text.includes("Negatives") && text.includes("Positives")) {
          setNutritionData(parseNutritionData(text));
          setDetectedText(text);
          setActiveTab("nutrition");
        } else {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const possibleName = text.split("\n")[0].slice(0, 50);

          const prompt = `Analyze this product and provide:
**Pros:**
- [benefit 1]
- [benefit 2]

**Cons:**
- [concern 1]
- [concern 2]

**Better Alternatives with product link:**

**Environmental Impact:**
[analysis]

Product: ${possibleName}
Details: ${text}`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const output = response.text();

          const prosMatch = output.match(/\*\*Pros:\*\*\s*([\s\S]*?)(\*\*Cons:\*\*|\*\*Environmental Impact:\*\*|$)/i);
          const consMatch = output.match(/\*\*Cons:\*\*\s*([\s\S]*?)(\*\*Environmental Impact:\*\*|$)/i);
          const impactMatch = output.match(/\*\*Environmental Impact:\*\*\s*([\s\S]*)/i);

          setPros(prosMatch?.[1]?.trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-/, '').trim()) || []);
          setCons(consMatch?.[1]?.trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-/, '').trim()) || []);
          setEnvironmentalImpact(impactMatch?.[1]?.trim() || "No environmental impact data found.");
          setActiveTab("pros");
        }
      } else {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const imagePart = { inlineData: { data: base64Img, mimeType: "image/png" } };

        const prompt = `You're a botanist specializing in Indian flora. Analyze this plant/leaf and provide:
**Identification:** [name, scientific name, family]
**Characteristics:** [leaf shape, size, features]
**Ecological Role:** [ecosystem benefits]
**Cultural Significance:** [Indian traditional uses]
**Conservation:** [status in India] 

OR if its a animal 

You're a wildlife biologist specializing in fauna. Analyze this animal and provide:

Identification:
Name (common and scientific), family, and classification (mammal/bird/reptile/etc.)

Characteristics:
Physical description (size, color, special features), habitat, behavior traits

Ecological Role:
Role in ecosystem (e.g., predator, seed disperser, pollinator), interactions with other species

Cultural Significance:
Importance in Indian culture, mythology, tribal beliefs, folklore, or traditional medicine

Conservation:
Rarity status in India (e.g., common, vulnerable, endangered), threats, and conservation efforts
`;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const output = response.text();
        const firstLine = output.split('\n')[0].replace('**', '').trim();
        
        setDetectedText(output);
        setPros([]);
        setCons([]);
        setEnvironmentalImpact(output);
        setActiveTab("environment");
      }
    } catch (error) {
      console.error("Scan error:", error);
      setError(error.message || "Failed to analyze image. Please try again.");
      setDetectedText("Analysis failed");
      setPros([]);
      setCons([]);
      setEnvironmentalImpact("");
      setNutritionData(null);
    } finally {
      setLoading(false);
      setShowAnalysisPanel(true);
    }
  };

  useEffect(() => {
    if (capturedImage) {
      const stream = webcamRef.current?.video?.srcObject;
      stream?.getTracks().forEach(track => track.stop());
    }
  }, [capturedImage]);

  const NutritionAnalysisTab = () => (
    <div className="space-y-6">

      <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
        <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2 text-lg">
          <FaThumbsDown className="text-red-500" />
          Health Considerations
        </h3>
        <ul className="space-y-4">
          {nutritionData?.negatives.map((item, index) => (
            <li key={index} className="bg-white p-3 rounded-lg shadow-xs border border-red-50">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {item.name.includes('Fat') ? (
                    <FaWeight className="text-red-400" />
                  ) : (
                    <FaHeartbeat className="text-red-400" />
                  )}
                  <span className="font-medium text-red-800">{item.name}</span>
                </div>
                <span className="font-bold text-red-600">{item.value}</span>
              </div>
              <div className="w-full bg-red-100 rounded-full h-2.5">
                <div 
                  className="bg-red-500 h-2.5 rounded-full" 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-red-500 mt-1">
                <span>0%</span>
                <span>{item.percentage}% of daily limit</span>
                <span>100%</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
        <h3 className="font-bold text-emerald-700 mb-3 flex items-center gap-2 text-lg">
          <FaThumbsUp className="text-emerald-500" />
          Nutritional Benefits
        </h3>
        <ul className="space-y-4">
          {nutritionData?.positives.map((item, index) => (
            <li key={index} className="bg-white p-3 rounded-lg shadow-xs border border-emerald-50">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {item.name.includes('Protein') ? (
                    <FaFireAlt className="text-emerald-400" />
                  ) : (
                    <GiMeal className="text-emerald-400" />
                  )}
                  <span className="font-medium text-emerald-800">{item.name}</span>
                </div>
                <span className="font-bold text-emerald-600">{item.value}</span>
              </div>
              <div className="w-full bg-emerald-100 rounded-full h-2.5">
                <div 
                  className="bg-emerald-500 h-2.5 rounded-full" 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-emerald-500 mt-1">
                <span>0%</span>
                <span>{item.percentage}% of daily value</span>
                <span>100%</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {nutritionData?.recommendations.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
          <h3 className="font-bold text-blue-700 mb-3 flex items-center gap-2 text-lg">
            <FaHeartbeat className="text-blue-500" />
            Health Tips
          </h3>
          <ul className="space-y-3">
            {nutritionData.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-blue-50">
                <span className="text-blue-500 mt-0.5 text-lg">{rec.icon}</span>
                <span className="text-blue-800">{rec.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm">
        <h3 className="font-bold text-purple-700 mb-4 flex items-center gap-2 text-lg">
          <MdLocalGroceryStore className="text-purple-500" />
          Healthier Alternatives
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {betterProducts.map((product, index) => (
            <div key={index} className="border border-purple-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-2">
                <span className="text-purple-500 text-xl mt-0.5">{product.icon}</span>
                <div>
                  <h4 className="font-bold text-purple-800">{product.name}</h4>
                  <p className="text-sm text-purple-600">{product.description}</p>
                </div>
              </div>
              <ul className="mb-3 space-y-1">
                {product.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-emerald-500">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center">
                <span className="font-bold text-purple-700">{product.price}</span>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
                  ))}
                </div>
              </div>
              <a 
                href={product.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-3 w-full flex items-center justify-center gap-2 text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FaShoppingCart /> Buy Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "pros":
        return pros.length > 0 ? (
          <ul className="space-y-3">
            {pros.map((item, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <FaThumbsUp className="text-emerald-500 mt-0.5 flex-shrink-0 text-lg" />
                <p className="text-emerald-800">{item}</p>
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-500 italic p-4">No benefits detected</p>;
      
      case "cons":
        return cons.length > 0 ? (
          <ul className="space-y-3">
            {cons.map((item, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                <FaThumbsDown className="text-red-500 mt-0.5 flex-shrink-0 text-lg" />
                <p className="text-red-800">{item}</p>
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-500 italic p-4">No concerns detected</p>;
      
      case "nutrition":
        return <NutritionAnalysisTab />;
      
      case "environment":
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              {scanMode === "product" ? (
                <MdEco className="text-blue-500 mt-0.5 flex-shrink-0 text-xl" />
              ) : (
                <FaTree className="text-blue-500 mt-0.5 flex-shrink-0 text-xl" />
              )}
              <p className="text-blue-800 whitespace-pre-line font-[450]">
                {environmentalImpact || "No environmental impact data available"}
              </p>
            </div>
            {detectedText && !environmentalImpact && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">Scanned Text:</h3>
                <p className="whitespace-pre-line text-gray-700">{detectedText}</p>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-start z-50 overflow-y-auto">

        <div className={`relative w-full ${showAnalysisPanel ? "h-[40vh]" : "h-full"}`}>
          {!capturedImage ? (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
                forceScreenshotSourceSize={true}
              />

              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex justify-between items-center">
                  <h2 className="text-white text-xl font-bold flex items-center gap-2 font-[500]">
                    <MdOutlineScreenSearchDesktop className="text-emerald-300" />
                    {scanMode === "product" ? "Product Scanner" : "Nature Scanner"}
                  </h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleFlash}
                      className="text-white hover:text-yellow-300 transition-colors text-2xl"
                      disabled={loading}
                    >
                      {flashOn ? (
                        <FaLightbulb className="text-yellow-300 animate-pulse" />
                      ) : (
                        <FaRegLightbulb />
                      )}
                    </button>
                    <button 
                      onClick={onClose} 
                      className="text-white hover:text-red-300 text-2xl transition-colors"
                      disabled={loading}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 justify-center">
                  {["product", "nature"].map(mode => (
                    <button
                      key={mode}
                      onClick={() => {
                        setScanMode(mode);
                        setCapturedImage(null);
                        setDetectedText("");
                        setShowAnalysisPanel(false);
                      }}
                      disabled={loading}
                      className={`px-4 py-1.5 rounded-full font-medium border-2 text-sm ${
                        scanMode === mode
                          ? mode === "product"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : "bg-blue-100 text-blue-800 border-blue-300"
                          : "text-white border-white/40 hover:bg-white/20"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {mode === "product" ? (
                        <span className="flex items-center gap-1">
                          <MdLocalGroceryStore /> Product
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <FaPaw /> Nature
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={capture}
                disabled={loading}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white p-5 rounded-full shadow-2xl hover:bg-gray-100 transition-colors flex items-center justify-center border-2 border-white/20"
              >
                <FaCamera className="text-emerald-600 text-2xl" />
              </button>
            </>
          ) : (
            <>
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-4 right-4 flex gap-3">
                <button
                  onClick={toggleFlash}
                  className="bg-black/50 p-3 rounded-full shadow-md hover:bg-black/70 transition-colors text-white"
                  disabled={loading}
                >
                  {flashOn ? (
                    <FaLightbulb className="text-yellow-300 text-xl" />
                  ) : (
                    <FaRegLightbulb className="text-xl" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setCapturedImage(null);
                    setShowAnalysisPanel(false);
                  }}
                  disabled={loading}
                  className="bg-black/50 p-3 rounded-full shadow-md hover:bg-black/70 transition-colors text-white"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </>
          )}
        </div>

        {showAnalysisPanel && (
          <div className="bg-white rounded-t-3xl p-5 shadow-2xl w-full flex-1 overflow-y-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="flex border-b border-gray-200 mb-5 overflow-x-auto">
              {scanMode === "product" && (
                <>
                  <button
                    className={`py-2 px-4 font-bold flex items-center gap-2 whitespace-nowrap text-sm ${
                      activeTab === "pros" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500 hover:text-emerald-500"
                    }`}
                    onClick={() => setActiveTab("pros")}
                  >
                    <FaThumbsUp /> Benefits
                  </button>
                  <button
                    className={`py-2 px-4 font-bold flex items-center gap-2 whitespace-nowrap text-sm ${
                      activeTab === "cons" ? "text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:text-red-500"
                    }`}
                    onClick={() => setActiveTab("cons")}
                  >
                    <FaThumbsDown /> Concerns
                  </button>
                  {nutritionData && (
                    <button
                      className={`py-2 px-4 font-bold flex items-center gap-2 whitespace-nowrap text-sm ${
                        activeTab === "nutrition" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500 hover:text-purple-500"
                      }`}
                      onClick={() => setActiveTab("nutrition")}
                    >
                      <IoMdNutrition /> Nutrition
                    </button>
                  )}
                </>
              )}
              <button
                className={`py-2 px-4 font-bold flex items-center gap-2 whitespace-nowrap text-sm ${
                  activeTab === "environment" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab("environment")}
              >
                {scanMode === "product" ? (
                  <FaRecycle />
                ) : (
                  <GiPlantSeed />
                )}
                {scanMode === "product" ? "Impact" : "Details"}
              </button>
            </div>

            <div className="min-h-[50vh]">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-pulse flex flex-col space-y-3 w-full">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="h-32 bg-gray-200 rounded mt-4"></div>
                  </div>
                </div>
              ) : (
                renderTabContent()
              )}
            </div>
          </div>
        )}

        {capturedImage && !showAnalysisPanel && (
          <div className="absolute bottom-6 left-0 right-0 px-6">
            <button
              onClick={scanImage}
              disabled={loading}
              className={`w-full px-6 py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg transition-colors text-lg font-bold ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              <MdOutlineScreenSearchDesktop className="text-xl" />
              {loading ? "Analyzing..." : "Analyze Image"}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-5">
      <div className="w-full max-w-6xl bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-gray-200">

        <div className={`relative ${showAnalysisPanel ? "md:w-1/2" : "w-full"} bg-black`}>
          {!capturedImage ? (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
                forceScreenshotSourceSize={true}
              />

              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex justify-between items-center">
                  <h2 className="text-white text-xl font-bold flex items-center gap-2 font-[500]">
                    <MdOutlineScreenSearchDesktop className="text-emerald-300" />
                    {scanMode === "product" ? "Product Scanner" : "Nature Scanner"}
                  </h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleFlash}
                      className="text-white hover:text-yellow-300 transition-colors text-2xl"
                      disabled={loading}
                    >
                      {flashOn ? (
                        <FaLightbulb className="text-yellow-300 animate-pulse" />
                      ) : (
                        <FaRegLightbulb />
                      )}
                    </button>
                    <button 
                      onClick={onClose} 
                      className="text-white hover:text-red-300 text-2xl transition-colors"
                      disabled={loading}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 justify-center">
                  {["product", "nature"].map(mode => (
                    <button
                      key={mode}
                      onClick={() => {
                        setScanMode(mode);
                        setCapturedImage(null);
                        setDetectedText("");
                        setShowAnalysisPanel(false);
                      }}
                      disabled={loading}
                      className={`px-4 py-1.5 rounded-full font-medium border-2 text-sm ${
                        scanMode === mode
                          ? mode === "product"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : "bg-blue-100 text-blue-800 border-blue-300"
                          : "text-white border-white/40 hover:bg-white/20"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {mode === "product" ? (
                        <span className="flex items-center gap-1">
                          <MdLocalGroceryStore /> Product
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <FaPaw /> Nature
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={capture}
                disabled={loading}
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white p-5 rounded-full shadow-2xl hover:bg-gray-100 transition-colors flex items-center justify-center border-2 border-white/20"
              >
                <FaCamera className="text-emerald-600 text-2xl" />
              </button>
            </>
          ) : (
            <>
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-4 right-4 flex gap-3">
                <button
                  onClick={toggleFlash}
                  className="bg-black/50 p-3 rounded-full shadow-md hover:bg-black/70 transition-colors text-white"
                  disabled={loading}
                >
                  {flashOn ? (
                    <FaLightbulb className="text-yellow-300 text-xl" />
                  ) : (
                    <FaRegLightbulb className="text-xl" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setCapturedImage(null);
                    setShowAnalysisPanel(false);
                  }}
                  disabled={loading}
                  className="bg-black/50 p-3 rounded-full shadow-md hover:bg-black/70 transition-colors text-white"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </>
          )}
        </div>

        {showAnalysisPanel && (
          <div className="md:w-1/2 bg-white p-6 overflow-y-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="flex border-b border-gray-200 mb-5 overflow-x-auto">
              {scanMode === "product" && (
                <>
                  <button
                    className={`py-2 px-4 font-bold flex items-center gap-2 whitespace-nowrap ${
                      activeTab === "pros" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500 hover:text-emerald-500"
                    }`}
                    onClick={() => setActiveTab("pros")}
                  >
                    <FaThumbsUp /> Benefits
                  </button>
                  <button
                    className={`py-2 px-4 font-bold flex items-center gap-2 whitespace-nowrap ${
                      activeTab === "cons" ? "text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:text-red-500"
                    }`}
                    onClick={() => setActiveTab("cons")}
                  >
                    <FaThumbsDown /> Concerns
                  </button>
                  {nutritionData && (
                    <button
                      className={`py-2 px-4 font-bold flex items-center gap-2 whitespace-nowrap ${
                        activeTab === "nutrition" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500 hover:text-purple-500"
                      }`}
                      onClick={() => setActiveTab("nutrition")}
                    >
                      <IoMdNutrition /> Nutrition
                    </button>
                  )}
                </>
              )}
              <button
                className={`py-2 px-4 font-bold flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "environment" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab("environment")}
              >
                {scanMode === "product" ? (
                  <FaRecycle />
                ) : (
                  <GiPlantSeed />
                )}
                {scanMode === "product" ? "Impact" : "Details"}
              </button>
            </div>

            <div className="min-h-[50vh]">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-pulse flex flex-col space-y-3 w-full">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="h-32 bg-gray-200 rounded mt-4"></div>
                  </div>
                </div>
              ) : (
                renderTabContent()
              )}
            </div>
          </div>
        )}

        {capturedImage && !showAnalysisPanel && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <button
              onClick={scanImage}
              disabled={loading}
              className={`px-6 py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg transition-colors text-lg font-bold ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              <MdOutlineScreenSearchDesktop className="text-xl" />
              {loading ? "Analyzing..." : "Analyze Image"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannerPopup;