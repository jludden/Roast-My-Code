import * as React from 'react';
import '../App.css';
import {annotationImage} from '../images';

const Inquiry = () => {
    return (
        <div>
            <h2>Report an issue</h2>
            <form name="report-issue" method="POST">
                <input type="hidden" name="form-name" value="report-issue" />
                <p style={{ display: "none" }}>
                    <label>Don’t fill this out if you're human: <input name="bot-field" /></label>
                </p>
                <p>
                    <label>Your Name: <input type="text" name="name" /></label>   
                </p>
                <p>
                    <label>Your Email: <input type="email" name="email" /></label>
                </p>
                <p>
                    <label>Your Role: <select name="role[]" multiple>
                    <option value="leader">Leader</option>
                    <option value="follower">Follower</option>
                    </select></label>
                </p>
                <p>
                    <label>Message: <textarea name="message"></textarea></label>
                </p>
                <p>
                    <button type="submit">Send</button>
                </p>
            </form>
        </div>
    );
}

export default Inquiry;