import React from "react";

const LoopIcon = (props) => {
    console.log("color = "+props.color)
    return <svg width={props.size+"px"} height={props.size+"px"}  viewBox="0 0 55 55" fill={props.color} xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M38 13H12C8.68629 13 6 15.6863 6 19V35C6 38.3137 8.68629 41 12 41H43C46.3137 41 49 38.3137 49 35V27H45V35C45 36.1046 44.1046 37 43 37H12C10.8954 37 10 36.1046 10 35V19C10 17.8954 10.8954 17 12 17H38V13Z" fill="fill"/>
<line x1="47" y1="27" x2="47" y2="25" stroke="fill" stroke-width="4" stroke-linecap="round"/>
<path d="M37.6845 10.5914C37.6845 9.82158 38.5178 9.34046 39.1845 9.72536L47.7624 14.6778C48.429 15.0627 48.429 16.025 47.7624 16.4099L39.1845 21.3623C38.5178 21.7472 37.6845 21.2661 37.6845 20.4963L37.6845 10.5914Z" fill="fill"/>
</svg>
}
export default LoopIcon