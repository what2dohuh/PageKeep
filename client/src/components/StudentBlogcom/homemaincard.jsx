/* eslint-disable react/prop-types */
import "../../style/homemaincard.css"
import Timeform from '../timeform';
import { Link } from 'react-router-dom';

const Homemaincard = ({data}) => {
    return (
        <div >
        <div className="container mt-5">
   <div className="row">
     <div className="col-12">
       <article className="blog-card">
         <div className="blog-card__background">
           <div className="card__background--wrapper">
             <div className="card__background--main" style={{backgroundImage: `url(${data.imageUrl})`}}>
               <div className="card__background--layer"></div>
             </div>
           </div>
         </div>
         <div className="blog-card__head">
           <span className="date__box">
             <span className="date__day"><Timeform time={data.timestamp}/></span>
             {/* <span className="date__month">JAN</span> */}
           </span>
         </div>
          <Link style={{textDecoration:"none"}} to={`/post/${data.postid}`}>
         <div className="blog-card__info">
           <h5>{data.heading}</h5>
           <p>
             <a href="#" className="icon-link mr-3"><i className="fa fa-pencil-square-o"></i> {data.user}</a>
             <a href="#" className="icon-link"><i className="fa fa-comments-o"></i> 150</a>
           </p>
           <p  dangerouslySetInnerHTML={{ __html: data.post.slice(0,100) }}></p>
           <a href="#" className="btn btn--with-icon"><i className="btn-icon fa fa-long-arrow-right"></i>READ MORE</a>
         </div>
         </Link>
       </article>
     </div>
   </div>
 </div>
 
 <section className="detail-page">
   <div className="container mt-5">
     
   </div>
 </section>
     </div>
    
    );
}

export default Homemaincard;
