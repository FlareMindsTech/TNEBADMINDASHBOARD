import React from 'react';
import './Enroll.css';

const BoxGroup = ({ count, legend, valueStr = '' }) => {
  return (
    <div className="flex-1">
      <div className="d-flex box-inputs">
        {[...Array(count)].map((_, i) => (
          <input
            key={i}
            type="text"
            maxLength="1"
            className="box-char"
            value={valueStr[i] && valueStr[i] !== ' ' ? valueStr[i] : ''}
            readOnly
            style={{ color: 'black', fontWeight: 'bold' }}
          />
        ))}
      </div>
      {legend && (
        <div className="d-flex mt-1">
          {legend.map((char, index) => (
            <div key={index} style={{ width: '25px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
              {char}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const LifeViewer = ({ formData }) => {
  return (
    <div className="ebf-container">
      <div className="ebf-paper form-shadow" style={{ pointerEvents: 'none' }}>
        <form>
          
          <div className="ebf-page pb-5">
             <div className="text-center mb-4 leading-tight">
               <div className="text-right" style={{fontSize: '0.8rem', fontWeight: 'bold'}}>
                 Ph.28133064, 28520731
               </div>
               <h2 className="mb-0" style={{fontSize: '1.4rem', fontWeight: '900', color: '#000'}}>T.N.E.B. Engineers' Association</h2>
               <p className="mb-0" style={{fontSize: '0.8rem', fontWeight: 'bold'}}>
                 793, Anna Salai, Chennai – 600 002.<br/>
                 (Website: tnebengineers.org)<br/>
                 (Regn.No.217/94) (Recognised in G.O.No.854 dated 06.04.1946)
               </p>
               
               <div className="mt-3">
                  <h3 style={{fontSize: '1.1rem', fontWeight: '900', textDecoration: 'underline', display: 'inline-block'}}>LIFE MEMBERSHIP APPLICATION</h3>
               </div>
               <div className="text-right mt-1" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>
                  L.M.No. <input type="text" className="inline-input border-btm w-20" name="lmNo" value={formData?.lmNo || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} />
               </div>
             </div>

             <div className="life-mem-body">
               <div className="d-flex field-row align-items-center">
                 <span className="sno">1.</span>
                 <label>Name in Block Letters<br/><span className="sub-label">(Initial at the end)</span></label>
                 <span className="colon">:</span>
                 <input type="text" name="name" value={formData?.name || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input text-uppercase flex-1 border-btm" />
               </div>
               
               <div className="d-flex field-row align-items-center">
                 <span className="sno">2.</span>
                 <label>Employee No.</label>
                 <span className="colon">:</span>
                 <BoxGroup count={8} valueStr={formData?.empNo || ''} />
               </div>
               
               <div className="d-flex field-row align-items-center mt-2">
                 <span className="sno">3.</span>
                 <label>Sex</label>
                 <span className="colon">:</span>
                 <div className="d-flex gap-0 border-box-group">
                    <label className="border-box-label m-0 px-2 py-1 border border-dark"><input type="radio" value="M" checked={formData?.sex === 'M'} readOnly className="mr-1"/>M</label>
                    <label className="border-box-label m-0 px-2 py-1 border border-dark border-left-0"><input type="radio" value="F" checked={formData?.sex === 'F'} readOnly className="mr-1"/>F</label>
                 </div>
               </div>

               <div className="d-flex field-row align-items-center mt-3">
                 <span className="sno">4.</span>
                 <label>Native Place &amp; District</label>
                 <span className="colon">:</span>
                 <input type="text" name="nativePlace" value={formData?.nativePlace || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input flex-1 border-btm" />
               </div>

               <div className="d-flex field-row align-items-center mt-2">
                 <span className="sno">5.</span>
                 <label>Designation</label>
                 <span className="colon">:</span>
                 <input type="text" name="designation" value={formData?.designation || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input flex-1 border-btm" />
               </div>

               <div className="d-flex field-row mt-2">
                 <span className="sno">6.</span>
                 <label>Date of Birth</label>
                 <span className="colon">:</span>
                 <BoxGroup count={8} legend={['D','D','M','M','Y','Y','Y','Y']} valueStr={formData?.dobBox || ''} />
               </div>

               <div className="d-flex field-row align-items-center mt-2">
                 <span className="sno">7.</span>
                 <label>Father's Name</label>
                 <span className="colon">:</span>
                 <input type="text" name="fatherName" value={formData?.fatherName || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input flex-1 border-btm" />
               </div>

               <div className="d-flex field-row mt-2">
                 <span className="sno">8.</span>
                 <label>Permanent Address</label>
                 <span className="colon">:</span>
                 <div className="flex-1">
                   <input type="text" name="permanentAddress" value={formData?.permanentAddress || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input w-100 border-btm mb-1" />
                   <div className="d-flex align-items-center mt-1">
                     <span className="mr-2">PIN Code</span>
                     <input type="text" name="permanentPin" value={formData?.permanentPin || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input flex-1 border-btm" />
                   </div>
                 </div>
               </div>

               <div className="d-flex field-row mt-3">
                 <span className="sno">9.</span>
                 <label>Present Address</label>
                 <span className="colon"></span>
               </div>
               
               <div className="d-flex field-row mt-1">
                 <span className="sno"></span>
                 <label className="pl-3">a) Office</label>
                 <span className="colon">:</span>
                 <div className="flex-1">
                   <input type="text" name="presentOfficeAddress" value={formData?.presentOfficeAddress || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input w-100 border-btm mb-1" />
                   <div className="d-flex align-items-center mt-1">
                     <span className="mr-2">PIN Code</span>
                     <input type="text" name="presentOfficePin" value={formData?.presentOfficePin || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input flex-1 border-btm" />
                   </div>
                   <div className="d-flex align-items-center mt-1">
                     <span className="mr-2">Phone:</span>
                     <input type="text" name="presentOfficePhone" value={formData?.presentOfficePhone || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input flex-1 border-btm" />
                   </div>
                 </div>
               </div>

               <div className="d-flex field-row mt-3">
                 <span className="sno"></span>
                 <label className="pl-3">b) Residence</label>
                 <span className="colon">:</span>
                 <div className="flex-1">
                   <input type="text" name="presentResAddress" value={formData?.presentResAddress || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input w-100 border-btm mb-1" />
                   <div className="d-flex align-items-center mt-1">
                     <span className="mr-2">PIN Code</span>
                     <input type="text" name="presentResPin" value={formData?.presentResPin || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input flex-1 border-btm" />
                   </div>
                   <div className="d-flex align-items-center mt-1">
                     <span className="mr-2">Phone:</span>
                     <input type="text" name="presentResPhone" value={formData?.presentResPhone || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input flex-1 border-btm" />
                   </div>
                 </div>
               </div>

               <div className="text-center mt-4 mb-2"><strong>- 1 -</strong></div>
               <div className="page-break"></div>

               <div className="d-flex field-row align-items-center mt-4">
                 <span className="sno">10.</span>
                 <label>Blood Group</label>
                 <span className="colon">:</span>
                 <input type="text" name="bloodGroup" value={formData?.bloodGroup || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input flex-1 border-btm" />
               </div>

               <div className="d-flex field-row align-items-center mt-2">
                 <span className="sno">11.</span>
                 <label>Spouse Name</label>
                 <span className="colon">:</span>
                 <input type="text" name="spouseName" value={formData?.spouseName || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input flex-1 border-btm" />
               </div>

               <div className="d-flex field-row align-items-center mt-2">
                 <span className="sno">12.</span>
                 <label>Working Branch</label>
                 <span className="colon">:</span>
                 <input type="text" name="workingBranch" value={formData?.workingBranch || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input flex-1 border-btm" />
               </div>

               <div className="d-flex field-row align-items-center mt-2">
                 <span className="sno">13.</span>
                 <label>Qualification</label>
                 <span className="colon">:</span>
                 <input type="text" name="qualification" value={formData?.qualification || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input flex-1 border-btm" />
               </div>

               <div className="d-flex field-row mt-2">
                 <span className="sno">14.</span>
                 <label>Entry Date</label>
                 <span className="colon">:</span>
                 <BoxGroup count={8} legend={['D','D','M','M','Y','Y','Y','Y']} valueStr={formData?.entryDt || ''} />
               </div>

               <div className="d-flex field-row align-items-center mt-3">
                 <span className="sno">15.</span>
                 <label>Field of Interest</label>
                 <span className="colon">:</span>
                 <input type="text" name="fieldOfInterest" value={formData?.fieldOfInterest || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input flex-1 border-btm" />
               </div>

               <div className="d-flex field-row align-items-center mt-2">
                 <span className="sno">16.</span>
                 <label>Awards</label>
                 <span className="colon">:</span>
                 <input type="text" name="awards" value={formData?.awards || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input flex-1 border-btm" />
               </div>

               <div className="d-flex field-row align-items-center mt-2">
                 <span className="sno">17.</span>
                 <label>Membership in any other<br/>Institution</label>
                 <span className="colon">:</span>
                 <input type="text" name="membershipOtherInst" value={formData?.membershipOtherInst || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input flex-1 border-btm" />
               </div>

               <div className="d-flex field-row align-items-center mt-2">
                 <span className="sno">18.</span>
                 <label>Any other Information</label>
                 <span className="colon">:</span>
                 <input type="text" name="anyOtherInfo" value={formData?.anyOtherInfo || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} className="form-input flex-1 border-btm" />
               </div>

               <div className="d-flex field-row mt-3">
                 <span className="sno">19.</span>
                 <label>Date of filling in the<br/>Application</label>
                 <span className="colon">:</span>
                 <BoxGroup count={8} legend={['D','D','M','M','Y','Y','Y','Y']} valueStr={formData?.fillDt || ''} />
               </div>

               <div className="d-flex field-row mt-4 align-items-center">
                 <span className="sno">20.</span>
                 <label>Signature</label>
                 <span className="colon">:</span>
                 <div className="flex-1">
                   <div className="sig-upload-inner" style={{ width: '60%', position: 'relative', overflow: 'hidden' }}>
                      {formData?.applicantSignature ? (
                         <img src={formData.applicantSignature} alt="Signature" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0 }} />
                      ) : (
                         <span style={{color:'black', fontWeight:'bold'}}>NO SIGNATURE SUBMITTED</span>
                      )}
                   </div>
                 </div>
               </div>

               <div className="mt-4 pl-4 font-weight-bold">
                  Encl: &nbsp; 1. 2 Stamp size photographs (Colour)<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  2. Specimen Signature in a separate paper
               </div>

               <div className="office-use-grid mt-5">
                  <div className="office-col border border-dark p-3">
                    <h4 className="text-center font-weight-bold" style={{textDecoration: 'underline'}}>For Branch Use</h4>
                    <div className="d-flex mt-3 fs-85">
                      <span className="text-nowrap">LM amount Rs.</span><span className="flex-1 border-btm mx-2"></span>
                      <span className="text-nowrap">DD.No.</span><span className="flex-1 border-btm ml-2"></span>
                    </div>
                    <div className="d-flex mt-3 fs-85">
                      <span className="text-nowrap">Dated</span><span className="w-30 border-btm mx-2"></span>
                      <span className="text-nowrap">Bank</span><span className="flex-1 border-btm ml-2"></span>
                    </div>
                    <div className="d-flex mt-3 fs-85">
                      <span className="text-nowrap">Branch</span><span className="flex-1 border-btm ml-2"></span>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-end mt-5 pt-3 fs-85">
                       <div className="d-flex"><span className="text-nowrap">Date</span><span className="border-btm ml-2" style={{width:'80px'}}></span></div>
                       <div className="text-center d-flex flex-column align-items-center">
                         <span className="border-btm" style={{width:'120px', height:'20px'}}></span>
                         <span className="mt-1" style={{ minHeight: '55px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>Signature &amp;<br/>Seal of Branch Sec.</span>
                       </div>
                    </div>
                  </div>
                  <div className="office-col border border-dark border-left-0 p-3">
                    <h4 className="text-center font-weight-bold" style={{textDecoration: 'underline'}}>For Head Office use</h4>
                    <div className="d-flex mt-3 fs-85">
                      <span className="text-nowrap">Receipt No.</span><span className="flex-1 border-btm mx-2"></span>
                      <span className="text-nowrap">Dated</span><span className="flex-1 border-btm ml-2"></span>
                    </div>
                    <div className="d-flex mt-3 fs-85">
                      <span className="text-nowrap">L.M.No.</span><span className="flex-1 border-btm ml-2"></span>
                    </div>
                    {/* Invisible spacer to match the height of the 'Branch' row on the left column */}
                    <div className="d-flex mt-3 fs-85" style={{ visibility: 'hidden' }}>
                      <span className="text-nowrap">Spacer</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-end mt-5 pt-3 fs-85 h-break">
                       <div className="d-flex"><span className="text-nowrap">Date</span><span className="border-btm ml-2" style={{width:'80px'}}></span></div>
                       <div className="text-center d-flex flex-column align-items-center">
                         <span className="border-btm" style={{width:'120px', height:'20px'}}></span>
                         <span className="mt-1" style={{ minHeight: '55px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>Signature of Treasurer<br/>TNEBEA</span>
                       </div>
                    </div>
                  </div>
               </div>
               
               <div className="text-center mt-5 mb-2"><strong>- 2 -</strong></div>
             </div>
             
          </div>
        </form>
      </div>
    </div>
  );
};
