import React, { useState } from 'react'
import SendButton from "../pages/images/icons8-sent-96.png"
import './Resultcard.css'
import { toast } from 'react-toastify';
import { PassCorrectSopUrl } from '../services/plan-service';

const CorrectUrlBottomForm = (props) => {
    const [correctUrl, setCorrectUrl] = useState('');
    // let {link, page, passingdata.モジュール, passingdata.状態, passingdata.エージェント, passingdata.query}=props.requireddata;
    const { link, page, passingdata: { モジュール, 状態, エージェント, query } } = props.requireddata;

    const handleSubmit = async () => {
        if (!correctUrl) {
            toast.error("Please Add Url")
            return;
        } else {
            props.changeState(false);
            
            let genratedData = {};
            genratedData["generated_sop"] = link;
            genratedData["correct_sop"] = correctUrl;
            genratedData["sop_type"] = "incorrect";
            genratedData["page_number"] = page;
            genratedData["module"] = モジュール;
            genratedData["state"] = 状態;
            genratedData["agent"] = エージェント;
            genratedData["prepared_query"] = query;
            genratedData["project"]=props.project
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
                    setCorrectUrl("")
                }
            } catch (err) {
                console.error(err)
                
            }
        }

    };

    return (

        <div className={`animated-div`}>
            <div className="resultcardupdate">
                <div>
                    <input
                        type="text"
                        className="add_correct_sop_url"
                        placeholder="Add Correct Url"
                        onChange={(e) => setCorrectUrl(e.target.value)}
                    />
                </div>
                <div className="result_card_buttons">
                    <img
                        src={SendButton}
                        alt="sendIcon"
                        className="result_radio_icons"
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </div>

    );
}

export default CorrectUrlBottomForm;