import React from 'react';
import "../../styles/news.css";

const NEWS = [
  { id: 1, title: 'We are grateful to our Sponsors and Partners on this journey', src: '/images/sponsor.webp', date: 'Dec 2025', category: 'School News' },
  { id: 2, title: 'Motus — Partnership announcement', src: '/images/motus.jpg', date: 'Nov 2025', category: 'School News' },
  { id: 3, title: 'Open Access Network DFA collaboration', src: '/images/DFA.webp', date: 'Oct 2025', category: 'School News' }
];

export default function LatestNews() {
  return (
    <div className="news-list">
      {NEWS.map(n => (
        <article key={n.id} className="news-card">
          <div className="thumb" style={{ backgroundImage: `url(${n.src})` }} />
          <div className="news-body">
            <h4>{n.title}</h4>
            <div className="meta">
              <span className="category">{n.category}</span>
              <span className="date">{n.date}</span>
            </div>
            <p className="small">Read more about our partnerships, collaborations, and school activities.</p>
            <button className="read-btn">Read More</button>
          </div>
        </article>
      ))}
    </div>
  );
}
