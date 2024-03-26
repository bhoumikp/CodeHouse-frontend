import React, { useState } from 'react';
import axios from "axios"
import './Editor.css'; // Import your CSS file for styling

function Editor() {
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState("cpp");
    const [status, setStatus] = useState(null);
    const [jobDetails, setJobDetails] = useState(null);
    const [jobId, setJobId] = useState(null);
    const [fontSize, setFontSize] = useState(16);
    const [lineHeight, setLineHeight] = useState(25);

    const [err, setErr] = useState('');

    let pollInterval;

    const handleClear = () => {
        setCode('');
        setOutput('');
    };

    const handleIncrease = () => {
        setFontSize(prevSize => prevSize + 2); // Increase font size by 2px
        setLineHeight(prevSize => prevSize + 2); // Increase font size by 2px
    };

    const handleDecrease = () => {
        setFontSize(prevSize => Math.max(prevSize - 2, 8)); // Decrease font size by 2px, but ensure it doesn't go below 8px
        setLineHeight(prevSize => Math.max(prevSize - 2, 8)); // Decrease font size by 2px, but ensure it doesn't go below 8px
    };
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        // alert("Code copied to clipboard!");
    };

    const handleSubmit = async () => {
        console.log("submit click");
        const payload = {
            language,
            code
        };
        try {
            setOutput("");
            setStatus(null);
            setJobId(null);
            setJobDetails(null);
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/run-code`, payload);
            setOutput(data.output);
            setJobId(data.jobId);
            setStatus("Submitted.");


        } catch (error) {
            if (error.response) {
                console.log(error.response);
                console.log("m in if loop");
                console.log(error.response.data.error);
                console.log(error.response.data.stderr);

                setOutput(error.response.data.error.stderr);
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // if (error.response.data && error.response.data.err) {
                //   const errMsg = error.response.data.err.stderr;
                //   setOutput(errMsg);
            } else if (error.request) {
                // The request was made but no response was received
                setOutput("No response received from the server.");
            } else {
                // Something happened in setting up the request that triggered an error
                setOutput("An error occurred. Please retry submitting.");
            }
        }

    };

    const codeEditorPlaceholder = `Type your ${language} code here...`;

    return (
        <>
            <div className="codebox-container">
                <div className='editor-container'>
                    <div className='editor-buttons-container'>
                        <div className="select-container">
                            <select className="select-language" value={language} onChange={(e) => { setLanguage(e.target.value); }}>
                                <option value="C++" > C++ </option>
                                <option value="Python" > Python </option>
                            </select>
                        </div>

                        <div className='utils-container'>
                            <button className="util run-btn" onClick={handleSubmit}>Run</button>
                            <button className="util" onClick={handleIncrease}>+</button>
                            <button className="util" onClick={handleDecrease}>-</button>
                            <button className="util" onClick={handleCopy}>Copy</button>
                            <button className="util" onClick={handleClear}>Clear</button>
                        </div>
                    </div>

                    <textarea className="code-editor" value={code} onChange={(e) => { setCode(e.target.value); }}
                        style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` }}
                        placeholder={codeEditorPlaceholder}>
                    </textarea>
                </div>

                <div className='output-container'>
                    <label className='output-label'>Output: <br></br><label className='output-text'>{output}</label></label>
                </div>
            </div>

        </>
    );
}

export default Editor;
