import { useState } from "react";
import "./ImageProcessing.css";
import { marked } from "marked";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Input from "./Input";
function ImageProcessing() {
  const [text1, setText1] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sy1, setsy1] = useState("");
  const [sy2, setsy2] = useState("");
  const [sy3, setsy3] = useState("");
  const [sy4, setsy4] = useState("");
  const [sy5, setsy5] = useState("");
  const [per, setper] = useState("");
  const [disease, setDisease] = useState(""); // State for disease name
  const [isChecked, setIsChecked] = useState(false);
  const [symptom, setSymptom] = useState("");
  const [pre, setPre] = useState(false);

  function extractBetween(x, startStr, endStr) {
    const startIndex = x.indexOf(startStr);
    const endIndex = x.indexOf(endStr, startIndex + startStr.length);
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      const section = x.substring(startIndex + startStr.length, endIndex);
      return marked(section.trim());
    } else {
      return "";
    }
  }

  function extractAfterWord(str, startWord) {
    const regex = new RegExp(`${startWord}\\s*[:：-]?\\s*(\\d+%?)`, "i");
    const match = str.match(regex);
    return match ? match[1] : "";
  }

  // Improved function to extract disease name - gets only the primary diagnosis
  function extractDiseaseName(str) {
    const regex = /Predicted Disease\s*[:：-]?\s*([^(.,\n]+)/i;
    const match = str.match(regex);
    
    if (match) {
      // Extract the main disease name and clean it up
      let disease = match[1].trim();
      
      // If there are multiple conditions separated by "or", take only the first one
      if (disease.includes(" or ")) {
        disease = disease.split(" or ")[0].trim();
      }
      
      // Remove any trailing characters like periods, commas, etc.
      disease = disease.replace(/[.,;:]$/, "").trim();
      
      return disease;
    }
    
    return "";
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      setImage({ base64, type: file.type });
    };
    reader.readAsDataURL(file);
    setPre(true);
  };

  // Updated prompt to request a concise disease name
  const modifiedPrompt = `
Analyze the image carefully and provide a detailed medical assessment. Structure the response using the following headings, and present the content in simple, clear bullet points:

### 1. Symptoms
List the key symptoms that are visually noticeable or commonly associated with the condition shown in the image.

### 2. Measures to Reduce Symptoms
Suggest effective home remedies, medical practices, or supportive treatments that help reduce or manage the symptoms.

### 3. Best Diet
Recommend the most suitable diet or foods that promote healing, reduce inflammation, or support recovery.

### 4. Precautions
Mention the important precautions or lifestyle adjustments the patient should follow to prevent worsening of the condition.

### 5. Tablets
Provide a list of commonly used over-the-counter or prescription medications/tablets used to treat or relieve the condition.

Also, give the accuracy percentage of the result at the bottom. Format it like: "Accuracy: 92%",
Give me the name of the final disease at the bottom. Format it EXACTLY like: "Predicted Disease: DiseaseName" (use just a single word or short phrase for the condition, without any explanations or disclaimers),
some of the symptoms are ${symptom}`;

  const handleClick = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imagePart = {
      inlineData: {
        mimeType: image.type,
        data: image.base64,
      },
    };

    try {
      const result = await model.generateContentStream({
        contents: [
          {
            role: "user",
            parts: [imagePart, { text: modifiedPrompt }],
          },
        ],
      });

      let fullText = "";
      setText1("");
      setsy1("");
      setsy2("");
      setsy3("");
      setsy4("");
      setsy5("");
      setper("");
      setDisease("");

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        setText1(marked(fullText));
      }

      // Extract sections
      setsy1(extractBetween(fullText, "1. Symptoms", "2. Measures to Reduce Symptoms"));
      setsy2(extractBetween(fullText, "2. Measures to Reduce Symptoms", "3. Best Diet"));
      setsy3(extractBetween(fullText, "3. Best Diet", "4. Precautions"));
      setsy4(extractBetween(fullText, "4. Precautions", "5. Tablets"));
      setsy5(extractBetween(fullText, "5. Tablets", "Accuracy"));

      setper(extractAfterWord(fullText, "Accuracy"));
      setDisease(extractDiseaseName(fullText));
    } catch (err) {
      console.error(err);
      setText1("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        onChange={handleImageChange}
      />
      <div className="gap-4 mt-4 flex justify-center items-center">
        <label htmlFor="imageUpload" className="upload-label items-center">
          Upload Image
        </label>

        {pre && image && (
          <img
            src={`data:${image.type};base64,${image.base64}`}
            alt="preview"
            className="w-20 h-20 object-cover rounded-lg shadow"
          />
        )}
      </div>

      <br />
      <div className="p-4 border rounded-xl shadow-md bg-white max-w-md mx-auto mt-6">
        <label className="flex items-center space-x-3 text-lg font-medium">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-0"
          />
          <span>Add custom symptom</span>
        </label>

        {isChecked && (
          <input
            type="text"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="Enter symptom..."
            className="mt-4 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}
      </div>
      <br />
      <button className="fetch-btn" onClick={handleClick} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {sy1 && (
            <div>
              <h1>Symptoms</h1>
              <div
                className="res1 shadow-xl leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sy1 }}
              />
            </div>
          )}
          {sy2 && (
            <div>
              <h1>Measures to Cure</h1>
              <div
                className="res2 shadow-xl leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sy2 }}
              />
            </div>
          )}
          {sy3 && (
            <div>
              <h1>Suitable Diet</h1>
              <div
                className="res3 shadow-xl leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sy3 }}
              />
            </div>
          )}
          {sy4 && (
            <div>
              <h1>Precautions</h1>
              <div
                className="res4 shadow-xl leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sy4 }}
              />
            </div>
          )}
          {sy5 && (
            <div>
              <h1>Medications</h1>
              <div
                className="res5 shadow-xl leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sy5 }}
              />
            </div>
          )}
          {per && (
            <div className="p-4 border-2 border-blue-500 rounded-2xl text-xl text-blue-800 shadow-lg bg-blue-50 mt-6 flex items-center gap-2">
              <h1 className="font-semibold">
                Accuracy: <span className="font-bold text-blue-700">{per}</span>
              </h1>
            </div>
          )}
          {disease && (
            <div className="p-4 border-2 border-green-500 rounded-2xl text-xl text-green-800 shadow-lg bg-green-50 mt-6 flex items-center gap-2">
              <h1 className="font-semibold">
                 Expected Disease: <span className="font-bold text-green-700">{disease}</span>
              </h1>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ImageProcessing;
