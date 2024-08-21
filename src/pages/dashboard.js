import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../auth';
// import Card from '../components/Card';
import Attachment from './images/icons8-attachment-100.png';
import RemoveIcon from './images/icons8-wrong-96.png';
import SubmitIcon from './images/icons8-sent-96.png';
import './dashboard.css';
import { ModuleStateAgent, PassEmailAnfGetPredictedUrl } from '../services/plan-service';
import { ClockLoader } from 'react-spinners';
import { toast } from 'react-toastify';

// import dummyData from './response-1702616416914.json';
import ExplainCard from '../components/ExplainCard';
import ResultCard from '../components/ResultCard';
import CorrectUrlBottomForm from '../components/CorrectUrlBottomForm';

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
 
  const navigate = useNavigate();
  const [resource, setResouce] = useState({})
  const [correctResources, setCorrectResources] = useState({})
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [predictedDataResult, setPredictedDataResult] = useState([])
  const [explainable_data, setExplainable_data] = useState([])
  const [sourceDocuments, setSourceDocuments] = useState([])
  const fileInputRef = React.createRef();
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [finalTime, setFinalTime] = useState('');

  const startTimer = () => {
    setFinalTime('')
    setTimer(0);
    setTimerRunning(true);
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return intervalId;
  };
  useEffect(() => {
    if (!timerRunning) {
      setFinalTime(formatTime(timer));
    }
  }, [timer, timerRunning]);
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} seconds`;
  };
  const stopTimer = (intervalId) => {
    clearInterval(intervalId);
    setTimerRunning(false);
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleFileChange = async (event) => {
    setIsOpen(false)
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFinalTime('')
      setFile(file);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        setFileName(e.target.result);
      };
      reader.readAsText(file);
      const formData = new FormData();
      formData.append('emails', file);
      try {
        const resourceApi = await ModuleStateAgent(formData)
        console.log(resourceApi.data)
        if (typeof (resourceApi.data) === "object") {
          setResouce(resourceApi.data)
        } else {
          toast.success(resourceApi.data)

        }
      } catch (err) {
        console.log(err)
      }

    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = () => {
    setIsOpen(false)
    setFile(null);
    setFileName('');
    fileInputRef.current.value = '';
    setResouce({})
  };

  const handleTextareaChange = (event) => {
    setIsOpen(false)
    setFile(null);
    setFileName('');
    setTextareaValue(event.target.value);
  };
  const getInputFormStyle = () => {
    if (fileName || textareaValue) {
      return { minHeight: '17.8rem' };
    }
    return { height: '4rem' };
  };

  const handleSubmit = async () => {
    setIsOpen(false)
    setFinalTime("")
    setPredictedDataResult([])
    setSourceDocuments([])
    setTimer(0);
    console.log('File to be submitted:', file);
    console.log('Text area data:', textareaValue);
    const intervalId = startTimer();
    try {
      setIsLoading(true);

      let dataToSend;
      if (file) {
        setTextareaValue('');

        const formData = new FormData();
        formData.append('emails', file);
        dataToSend = formData;
      } else if (textareaValue) {
        setFile(null);
        setFileName('');
        const jsonBody = {
          email: textareaValue
        };
        dataToSend = jsonBody;
      } else {
        console.log('No file or text to submit.');
        toast.error("Empty Input")
        setIsLoading(false);
        stopTimer(intervalId);
        return;
      }
      if(!file){
      try {
        const resourceApi = await ModuleStateAgent(dataToSend)
        console.log(resourceApi.data)
        if (typeof (resourceApi.data) === "object") {
          setResouce(resourceApi.data)
        } else {
          toast.success(resourceApi.data)

        }
      } catch (err) {
        console.log(err)
      }
    }
      const response = await PassEmailAnfGetPredictedUrl(dataToSend);
      console.log('Submission successful:', response);
      if (typeof (response.data) === "object") {
        setPredictedDataResult(response.data?.result);
        setExplainable_data(response.data?.explainable_data[0])
        setSourceDocuments(response.data?.explainable_data[0]?.source_documents)
        stopTimer(intervalId);
      } else {
        toast.success(response.data)
        stopTimer(intervalId);

      }
      setIsLoading(false);



    } catch (error) {

      toast.error(error.message)
      setIsLoading(false);
      stopTimer(intervalId);
      console.error('Error during submission:', error);
    }
  };

  const wrongClick=(data,otherdata)=>{
    setIsOpen(false)
    setCorrectResources(otherdata)
    setIsOpen(data);
  }

  return (
    <>
      <div className='input-container'>
        {/* <h1 className='main-title'>Title</h1> */}
        <div className='input-form-email' style={getInputFormStyle()}>
          <input
            type='file'
            size="60"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".txt,.eml"
          />
          <img
            src={Attachment}
            alt='attachment'
            className='attachment-icon'
            onClick={handleIconClick}
          />
          {fileName && <span style={{ marginLeft: '10px' }}>{fileName}</span>}
          {!fileName && (
            <textarea
              className='email_text_upload_text'
              placeholder='add email data'
              rows={6}
              value={textareaValue}
              onChange={handleTextareaChange}
            />
          )}
          {fileName && <img src={RemoveIcon} onClick={handleRemoveFile} alt='removeIcon' className='attachment-icon' />}
          {!isLoading && <img src={SubmitIcon} onClick={handleSubmit} alt='sendIcon' className='attachment-icon' />}
        </div>
        
      </div>
      {timerRunning && (
              <div className="timer">
                Time elapsed: {formatTime(timer)}
              </div>
            )}
            {!isLoading && (predictedDataResult.length > 0 || Object.keys(explainable_data).length > 0 || sourceDocuments.length > 0) && finalTime && (
              <div className="timer">
                Total time taken: {finalTime}
              </div>
            )}


      {resource && Object.keys(resource).length > 0 && (
        <div className='resource-with-time'>
          <div className="resource-info">
            <ul>
              {Object.keys(resource).map((key) => (
                <li key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong> : {resource[key]}</li>
              ))}
            </ul>
          </div>
          
        </div>
      )}

      {isLoading && <ClockLoader
        color="orange"
        loading={isLoading}
        className='loadder_waittime'
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
        speedMultiplier={2}
      />}


      {!isLoading &&
        <div className='resultcards'>
          {predictedDataResult.map((card, index) => (
            <ResultCard
              key={index}
              識別子={card.識別子}
              モジュール={card.モジュール}
              エージェント={card.エージェント}
              状態={card.状態}
              wiki={card.wiki}
              passingdata={explainable_data}
              link={card.SOP_url}
              page={card.page}
              onSubmit={wrongClick}
              currentValue={index}
              project={resource["project"]}
            />

          ))}
        </div>
      }

      {isOpen &&
        <div className='resultcards_data'>
          <CorrectUrlBottomForm 
            requireddata={correctResources}
            changeState={wrongClick}
            project={resource["project"]}
          />
        </div>
      }

      {!isLoading && sourceDocuments.length > 0 && (
        <div className='explainable_data'>
          <hr />
          {predictedDataResult.length > 0 && (
            <>
              <h1>Explainable Data</h1>
              <p className='main_data'>
                <span className='key'>モジュール </span>: {explainable_data?.モジュール}
              </p>
              <p className='main_data'>
                <span className='key'>状態 </span>: {explainable_data?.状態}
              </p>
              <p className='main_data'>
                <span className='key'>エージェント </span>: {explainable_data?.エージェント}
              </p>
              <p className='main_data'>
                <span className='key'>query </span>: {explainable_data?.query}
              </p>
              <h2>Source Documents</h2>
            </>
          )}
          <div className="explain_data_documents">
            {sourceDocuments.map((doc, index) => (
              <ExplainCard
                key={index}
                page={doc.ページ}
                wiki_content={doc.ウィキコンテンツ}
                wiki_title={doc.ウィキタイトル}
                state={doc.状態}
                agent={doc.エージェント}
                identifier={doc.識別子}
                module={doc.モジュール}
              />
            ))}
          </div>
        </div>
      )}



    </>
  );
};

export default Dashboard;
