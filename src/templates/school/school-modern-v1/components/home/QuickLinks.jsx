import React from 'react';
import "../../styles/quicklinks.css";


const LINKS = [
{ title:'Students', items:['Calendars','Term dates','Student Daily Bulletin','Subject Choices','Past Matric Papers'] },
{ title:'Staff', items:['Ed-admin Staff Portal','Term dates','SGB', 'Attendance Policy'] },
{ title:'Parents', items:['Admissions','Term dates','School Calendar','Stationary requirements','Contact us'] }
];


export default function QuickLinks(){
return (
<div className="quicklinks">
{LINKS.map(sec => (
<div key={sec.title} className="ql-section">
<h5>{sec.title}</h5>
<ul>
{sec.items.map(it => (
<li key={it}>
<a href="#!" className="ql-link">
<span className="ql-icon">•</span>
{it}
</a>
</li>
))}
</ul>
</div>
))}
</div>
);
}