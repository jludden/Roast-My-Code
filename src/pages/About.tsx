import * as React from 'react';
import '../App.css';
import annotationImage from '../static/undraw_annotation_7das.png';

const About = () => {
    return (
        <div>
            <h2>About</h2>
            <img src={annotationImage} alt="person reviewing document with annotations" />
        </div>
    );
}

export default About;