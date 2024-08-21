import React, { useState } from 'react'
import './Resultcard.css'
import { BiSolidRightArrowCircle } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import Info from "../pages/images/icons8-info-96.png"
import { toast } from 'react-toastify';
import { PassCorrectSopUrl } from '../services/plan-service';


const ResultCard = ({ 識別子, モジュール, エージェント, 状態, wiki, page, link, passingdata, onSubmit, currentValue,project }) => {
  const [isOpen, setIsOpen] = useState(true);
  console.log(project)
  function handleClick(currentValue) {
    onSubmit(isOpen, { 識別子, モジュール, エージェント, 状態, wiki, page, link, passingdata })
    setIsOpen(isOpen);

    const element = document.querySelector('.resultcards_data');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    window.scrollBy({ top: 140, left: 0, behavior: 'smooth' });
  }

  const handleUserResponse = async (...passedData) => {
console.log(passedData)
    let genratedData = {};
    const [checkUrl, generated_sop, page_number, correct_sop, module, state, agent, prepared_query,project] = passedData;
    if (checkUrl) {
      genratedData["generated_sop"] = generated_sop;
      genratedData["correct_sop"] = generated_sop;
      genratedData["sop_type"] = "correct";
    } else if (correct_sop === "ignore") {
      genratedData["generated_sop"] = generated_sop;
      genratedData["correct_sop"] = "";
      genratedData["sop_type"] = "ignore";
    }
    else {
      genratedData["generated_sop"] = generated_sop;
      genratedData["correct_sop"] = correct_sop;
      genratedData["sop_type"] = "incorrect";
    }
    genratedData["page_number"] = page_number;
    genratedData["module"] = module;
    genratedData["state"] = state;
    genratedData["agent"] = agent;
    genratedData["prepared_query"] = prepared_query;
    genratedData["project"]=project;
    console.log(genratedData)
    try {
      const response = await PassCorrectSopUrl(genratedData)
      if (response.status === 200) {
        if (response.data === null) {
          toast.success("Alredy Done")
        } else {
          toast.success(response.data)
        }
        console.log(response)
      }
    } catch (err) {
      console.error(err)
    }
  }




  const handleArrowButtonClick = (link) => {
    if (link) {
      window.open(link, "blank");
    } else {
      console.warn("No link provided for arrow-button");
    }
  };

  return (
    <div className={`all_cards`}  >
      <div className='resultcard'>
        <button className='arrow-button' onClick={() => handleArrowButtonClick(link)} ><BiSolidRightArrowCircle size={"2rem"} /> この手順をみる</button>

        <div className='result_details' >
          <span>識別子</span>
          <strong>{識別子}</strong>
        </div>
        <div>
          <span>モジュール</span>
          <strong>{モジュール}</strong>
        </div>
        <div>
          <span>エージェント</span>
          <strong>{エージェント}</strong>
        </div>
        <div>
          <span>状態</span>
          <strong>{状態}</strong>
        </div>
        <div>
          <span>wiki</span>
          <strong>{wiki}</strong>
        </div>
        <div>
          <hr></hr>
          <span className='feedback'> <img src={Info} alt='Wrong Icon' className='feedback_ico' />feedback</span>

          <button onClick={() => handleUserResponse(1, link, page, link, passingdata.モジュール, passingdata.状態, passingdata.エージェント, passingdata.query,project)} ><FaCheckCircle size={"1.7rem"} /> これが正解</button>
          {/* <button onClick={() => setModalShow(true)}  ><TiDelete size={"2.2rem"} />  wrong</button> */}

          {/* <button onClick={isCardDisabled ? disableCard : () => handleUserResponse(0, link, page, "ignore", passingdata.モジュール, passingdata.状態, passingdata.エージェント, passingdata.query)}><TiDelete size={"2.2rem"} /> これは対応手順ではない</button> */}
          <button onClick={() => handleClick(currentValue)} ><TiDelete size={"2.2rem"} /> これは対応手順ではない</button>
          {/* onClick={() => setModalShow(true)}  onClick={handleClick} */}
        </div>
      </div>

    </div>
  )
}

export default ResultCard