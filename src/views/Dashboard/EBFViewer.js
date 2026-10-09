import React from 'react';
import './Enroll.css';
import TnebLogoImg from 'assets/img/tnebea_logo_cropped2.webp';

export const EBFViewer = ({ formData }) => {
  // Simple layout that scales down to fit the modal
  return (
    <div className="ebf-container" style={{ margin: '0 auto', maxWidth: '900px' }}>
      <div className="ebf-paper form-shadow" style={{ pointerEvents: 'none' }}>
        {/* ================= PAGE 1: APPLICATION ================= */}
          <div className="ebf-page">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div className="w-150">
                <img src={TnebLogoImg} alt="TNEB Logo" className="ebf-logo" />
              </div>
              <div className="ebf-header-text flex-1 text-center px-3">
                <h2 style={{fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 5px 0'}}>T.N.E.B. ENGINEERS' BENEVOLENT FUND</h2>
                <p className="reg-text">Reg. No.217/94 Recognised in G.O.No.854 Dt.6.4.1946</p>
                <p className="address-text">Electricity Avenue, 144, Anna Salai, Chennai - 600 002. Ph : 044 - 28520731 / 044 - 28517307</p>
                <p className="address-text">email : tnebea@gmail.com, Website : www.tnebengineers.in</p>
                <p className="admin-text">(Administered by the TNEB Engineer's Association)</p>
                <h3 className="app-title-box">APPLICATION</h3>
              </div>
              <div className="w-150 text-right">
                <div style={{fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap'}}>EBF VII No.</div>
                <input type="text" className="inline-input no-border-btm w-100 mt-1" name="ebfViiNo" value={formData.ebfViiNo || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} />
              </div>
            </div>

            <div className="ebf-body">
              <div className="flex-row photo-container">
                <div className="fields-col">
                  <div className="d-flex field-row">
                    <span className="sno">1.</span>
                    <label>Name of the Applicant<br/><span className="sub-label">(in capital letters)</span></label>
                    <span className="colon">:</span>
                    <input type="text" name="applicantName" value={formData.applicantName || ''} readOnly className="form-input text-uppercase flex-1" style={{ color: 'black', opacity: 1, fontWeight: 'bold' }} required />
                  </div>
                  <div className="d-flex field-row">
                    <span className="sno">2.</span>
                    <label>Male or Female</label>
                    <span className="colon">:</span>
                    <div className="d-flex gap-3 flex-1 align-items-center">
                      <label className="radio-inline"><input type="radio" checked={formData?.gender === 'Male'} readOnly style={{ opacity: 1 }} /> Male</label>
                      <label className="radio-inline"><input type="radio" checked={formData?.gender === 'Female'} readOnly style={{ opacity: 1 }} /> Female</label>
                    </div>
                  </div>
                  <div className="d-flex field-row">
                    <span className="sno">3.</span>
                    <label>Qualification with Discipline</label>
                    <span className="colon">:</span>
                    <input type="text" name="qualification" value={formData.qualification || ''} readOnly className="form-input flex-1" style={{ color: 'black', fontWeight: 'bold' }} required />
                  </div>
                  <div className="d-flex field-row">
                    <span className="sno">4.</span>
                    <label>Official Designation and<br/>Office Address</label>
                    <span className="colon">:</span>
                    <textarea name="designationAddress" value={formData.designationAddress || ''} readOnly className="form-input flex-1" rows="2" style={{ color: 'black', fontWeight: 'bold' }} required></textarea>
                  </div>
                </div>
                <div className="photo-box">
                  <div className="photo-inner" style={{ position: 'relative', overflow: 'hidden' }}>
                    {formData.applicantPhoto ? (
                       <img src={formData.applicantPhoto} alt="Applicant" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                    ) : (
                       <span>PASSPORT SIZE<br/>PHOTO OF<br/>APPLICANT<br/><br/><small style={{color: '#c92a2a', fontWeight: 'bold'}}>(JPG, 20-50KB)</small></span>
                    )}
                    <input type="file" className="photo-upload" name="applicantPhoto" accept="image/jpeg, image/jpg" onChange={(e) => setFormData(prev => ({...prev, applicantPhoto: e.target.files[0]}))} />
                  </div>
                </div>
              </div>

              <div className="d-flex field-row mt-3">
                <span className="sno">5.</span>
                <label>Date of Birth<br/><span className="sub-label">(as per service register)</span></label>
                <span className="colon">:</span>
                <input type="date" name="dob" value={formData.dob} readOnly disabled className="form-input flex-1" required />
              </div>
              <div className="d-flex field-row">
                <span className="sno">6.</span>
                <label>Date of Entry<br/><span className="sub-label">(in the Board's Service)</span></label>
                <span className="colon">:</span>
                <input type="date" name="dateOfEntry" value={formData.dateOfEntry} readOnly disabled className="form-input flex-1" required />
              </div>
              <div className="d-flex field-row">
                <span className="sno">7.</span>
                <label>Date of Retirement</label>
                <span className="colon">:</span>
                <input type="date" name="dateOfRetirement" value={formData.dateOfRetirement} readOnly disabled className="form-input flex-1" required />
              </div>
              <div className="d-flex field-row">
                <span className="sno">8.</span>
                <label>If Married, Date of Marriage</label>
                <span className="colon">:</span>
                <input type="date" name="dateOfMarriage" value={formData.dateOfMarriage} readOnly disabled className="form-input flex-1" />
              </div>
              <div className="d-flex field-row">
                <span className="sno">9.</span>
                <label>Present Address<br/><span className="sub-label">(in capital letters)</span></label>
                <span className="colon">:</span>
                <textarea name="presentAddress" value={formData.presentAddress} readOnly disabled className="form-input text-uppercase flex-1" rows="2" required></textarea>
              </div>
              <div className="d-flex field-row">
                <span className="sno">10.</span>
                <label>Permanent Address<br/><span className="sub-label">(in capital letters)</span></label>
                <span className="colon">:</span>
                <textarea name="permanentAddress" value={formData.permanentAddress} readOnly disabled className="form-input text-uppercase flex-1" rows="2" required></textarea>
              </div>
              <div className="d-flex field-row">
                <span className="sno">11.</span>
                <label>Mobile No</label>
                <span className="colon">:</span>
                <input type="tel" name="mobileNo" value={formData.mobileNo} readOnly disabled className="form-input flex-1" required />
              </div>
              <div className="d-flex field-row">
                <span className="sno">12.</span>
                <label>Email Id</label>
                <span className="colon">:</span>
                <input type="email" name="emailId" value={formData.emailId || ''} readOnly className="form-input flex-1" style={{ color: 'black', fontWeight: 'bold' }} required />
              </div>
              <div className="d-flex field-row">
                <span className="sno">13.</span>
                <label>If the Applicant is a member<br/>in the Existing EBF Schemes<br/><span className="sub-label">(Furnish the Detail)</span></label>
                <span className="colon">:</span>
                <div className="d-flex gap-2 flex-1 flex-wrap align-items-center">
                  {['EBF I', 'II', 'III', 'IV', 'V', 'VI', 'No.'].map(opt => (
                    <label key={opt} className="radio-inline"><input type="radio" checked={formData?.existingEbfMember === opt} readOnly style={{ opacity: 1 }} /> {opt}</label>
                  ))}
                </div>
              </div>
              <div className="d-flex field-row">
                <span className="sno">14.</span>
                <label>Mode the Payment<br/><span className="sub-label">Full Subscription at a time</span></label>
                <span className="colon">:</span>
                <div className="flex-1 payment-row">
                  <span>Rs.</span><input type="number" name="paymentAmount" value={formData.paymentAmount} readOnly disabled className="inline-input w-20" required />
                  <span>DD No.</span><input type="text" name="ddNo" value={formData.ddNo} readOnly disabled className="inline-input w-20" required />
                  <span>Date</span><input type="date" name="ddDate" value={formData.ddDate} readOnly disabled className="inline-input border-btm" required />
                  <br/>
                  <span>Drawn on</span><input type="text" name="drawnOn" value={formData.drawnOn} readOnly disabled className="inline-input w-30" required />
                  <span>at</span><input type="text" name="branch" value={formData.branch} readOnly disabled className="inline-input w-30" required />
                  <span>branch</span>
                </div>
              </div>

              <div className="certifies-section mt-4">
                <p className="bold-text">Certifies that :</p>
                <div className="d-flex field-row">
                  <span className="sno">1.</span>
                  <div>I am Life Member of the TNEB Engineers' Association bearing L.M. No. <input type="text" name="lmNo" value={formData.lmNo} readOnly disabled className="inline-input w-30" required /></div>
                </div>
                <div className="d-flex field-row">
                  <span className="sno">2.</span>
                  <div>I am not a Member of similar benevolent Fund(s) of any other Union(s) of any other Union(s) Association (s) of the TANGEDCO.</div>
                </div>
                <div className="d-flex field-row">
                  <span className="sno">3.</span>
                  <div>The particulars furnished are correct to the best of my knowledge.</div>
                </div>
              </div>

              <div className="signatures-row mt-4">
                <div className="d-flex align-items-center mb-3">
                  <span className="mr-2">Date:</span>
                  <input type="date" name="applicantDate" value={formData.applicantDate || ''} readOnly className="form-input" style={{ width: '150px', color: 'black', fontWeight: 'bold' }} />
                </div>
                <div className="signature-upload-box">
                  <div className="sig-upload-inner" style={{ position: 'relative', overflow: 'hidden' }}>
                     {formData.applicantSignature ? (
                        <img src={formData.applicantSignature} alt="Signature" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0 }} />
                     ) : (
                        <span>UPLOAD SIGNATURE<br/><small>(JPG/JPEG, 10-50KB)</small></span>
                     )}
                     <input type="file" className="photo-upload" name="applicantSignature" accept="image/jpeg, image/jpg" onChange={(e) => setFormData(prev => ({...prev, applicantSignature: e.target.files[0]}))} />
                  </div>
                  <div className="bold-text mt-2 text-center">SUBSCRIBER'S SIGNATURE</div>
                </div>
              </div>

              <div className="notes-section mt-3">
                <div className="d-flex field-row">
                  <span className="bold-text">Note :</span>
                </div>
                <div className="d-flex field-row">
                  <span className="sno">1.</span>
                  <div>The EBF VII Scheme will be operationalised only on enrolling 1000 members in scheme VII</div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-4 mb-2">
               <strong>- 1 -</strong>
            </div>

            {/* Page Break line for digital view */}
            <div className="page-break"></div>
          </div>

          {/* ================= PAGE 2: NOMINATION ================= */}
          <div className="ebf-page">
            <div className="nomination-header">
               <div className="text-right note-small">
                 <span className="mr-2">EBF VII No.</span><input type="text" className="inline-input w-20" readOnly style={{ color: 'black', fontWeight: 'bold' }} value={formData.ebfViiNo || ''} />
               </div>
               <p className="text-center note-small mt-2">Note : Members are advised to NOMINATE ONLY THEIR LEGAL HEIR(S) Contemplated in succession Act.</p>
               <h3 className="section-main-title text-center mt-3 mb-4">T.N.EB. ENGINEERS' BENEVOLENT FUND NOMINATION</h3>
            </div>
            
            <div className="nomination-body">
              <p className="mb-4">
                I <input type="text" className="inline-input w-30 border-btm" value={formData.applicantName || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} /> having a family / having no family, hereby nominate one person or more than one person who is / are legal heir(s) as mentioned below to receive the payment from the Benevolent Fund in the event of my death.
              </p>

              <div className="flex-row photo-container">
                <div className="fields-col">
                  <div className="d-flex field-row">
                    <span className="sno">1.</span>
                    <label>Name of the Nominee<br/><span className="sub-label">(in case of more than one person<br/>share in percentage to be specified)</span></label>
                    <span className="colon">:</span>
                    <input type="text" name="nomineeName" value={formData.nomineeName} readOnly disabled className="form-input flex-1" required />
                  </div>
                  <div className="d-flex field-row">
                    <span className="sno">2.</span>
                    <label>Address of the Nominee</label>
                    <span className="colon">:</span>
                    <textarea name="nomineeAddress" value={formData.nomineeAddress} readOnly disabled className="form-input flex-1" rows="3" required></textarea>
                  </div>
                </div>
                <div className="photo-box">
                  <div className="photo-inner" style={{ position: 'relative', overflow: 'hidden' }}>
                    {formData.nomineePhoto ? (
                       <img src={formData.nomineePhoto} alt="Nominee" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                    ) : (
                       <span>PASS PORT SIZE<br/>PHOTO OF<br/>NOMINATED<br/>PERSON (S)<br/><small style={{color: '#c92a2a', fontWeight: 'bold'}}>(JPG, 20-50KB)</small></span>
                    )}
                    <input type="file" className="photo-upload" name="nomineePhoto" accept="image/jpeg, image/jpg" onChange={(e) => setFormData(prev => ({...prev, nomineePhoto: e.target.files[0]}))} />
                  </div>
                </div>
              </div>

              <div className="d-flex field-row mt-3">
                <span className="sno">3.</span>
                <label>Relationship of the Nominee</label>
                <span className="colon">:</span>
                <input type="text" name="nomineeRelationship" value={formData.nomineeRelationship} readOnly disabled className="form-input flex-1" required />
              </div>
              <div className="d-flex field-row">
                <span className="sno">4.</span>
                <label>Date of Birth of the Nominee</label>
                <span className="colon">:</span>
                <input type="date" name="nomineeDob" value={formData.nomineeDob} readOnly disabled className="form-input flex-1" required />
              </div>
              <div className="d-flex field-row">
                <span className="sno">5.</span>
                <label>Three Specimen Signature(s)<br/>of the nominee obtained in the<br/>presence of the subscriber<br/>and attested</label>
                <span className="colon">:</span>
                 <div className="sig-upload-inner spec-sig-box flex-1" style={{ position: 'relative', overflow: 'hidden' }}>
                    {formData.specimenSignature ? (
                        <img src={formData.specimenSignature} alt="Specimen Signature" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0 }} />
                    ) : (
                       <span>UPLOAD 3 SPECIMEN SIGNATURES<br/><small>(JPG/JPEG, Max 100KB)</small></span>
                    )}
                    <input type="file" className="photo-upload" name="specimenSignature" accept="image/jpeg, image/jpg" onChange={(e) => setFormData(prev => ({...prev, specimenSignature: e.target.files[0]}))} />
                 </div>
              </div>
              <div className="d-flex field-row">
                <span className="sno">6.</span>
                <label>Contingencies on the happening<br/>of which are nomination shall<br/>become invalid</label>
                <span className="colon">:</span>
                <textarea name="contingencies" value={formData.contingencies} readOnly disabled className="form-input flex-1" rows="2"></textarea>
              </div>
              <div className="d-flex field-row">
                <span className="sno">7.</span>
                <label>In the event of the item (6) the right<br/>of the nominee shall pass onto</label>
                <span className="colon">:</span>
              </div>
              <div className="sub-fields ml-4">
                <div className="d-flex field-row">
                  <label className="w-150">(a) Name(s)</label><span className="colon">:</span><input type="text" name="rightPassName" value={formData.rightPassName} readOnly disabled className="form-input flex-1" />
                </div>
                <div className="d-flex field-row">
                  <label className="w-150">(b) Address(s)</label><span className="colon">:</span><input type="text" name="rightPassAddress" value={formData.rightPassAddress} readOnly disabled className="form-input flex-1" />
                </div>
                <div className="d-flex field-row">
                  <label className="w-150">(c) Relationship of the person (s)</label><span className="colon">:</span><input type="text" name="rightPassRelationship" value={formData.rightPassRelationship} readOnly disabled className="form-input flex-1" />
                </div>
                <div className="d-flex field-row">
                  <label className="w-150">(d) Date of Birth of the person(s)</label><span className="colon">:</span><input type="date" name="rightPassDob" value={formData.rightPassDob} readOnly disabled className="form-input flex-1" />
                </div>
              </div>

              <div className="signatures-row mt-5">
                <div className="d-flex align-items-center mb-3">
                  <span className="mr-2">Date:</span>
                  <input type="date" name="applicantDateNom" value={formData.applicantDateNom || ''} readOnly className="form-input" style={{ width: '150px', color: 'black', fontWeight: 'bold' }} />
                </div>
                <div className="signature-upload-box">
                  <div className="sig-upload-inner" style={{ position: 'relative', overflow: 'hidden' }}>
                     {formData.applicantSignatureNom ? (
                        <img src={formData.applicantSignatureNom} alt="Signature" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0 }} />
                     ) : (
                        <span>UPLOAD SIGNATURE<br/><small>(JPG/JPEG, 10-50KB)</small></span>
                     )}
                     <input type="file" className="photo-upload" name="applicantSignatureNom" accept="image/jpeg, image/jpg" onChange={(e) => setFormData(prev => ({...prev, applicantSignatureNom: e.target.files[0]}))} />
                  </div>
                  <div className="bold-text mt-2 text-center">SUBSCRIBER'S SIGNATURE</div>
                </div>
              </div>

              <div className="witnesses-section mt-4">
                <p className="bold-text mb-3">WITNESSES</p>
                <div className="witness-grid">
                  <div className="wit-header row text-center">
                    <div className="col-4">Signature</div>
                    <div className="col-4">Name</div>
                    <div className="col-4">Address of the Witness</div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-4 d-flex align-items-center">
                      <span className="mr-2">1.</span>
                      <div className="sig-upload-inner w-100" style={{height: '50px', position: 'relative', overflow: 'hidden'}}>
                        {formData.wit1Signature ? (
                            <img src={formData.wit1Signature} alt="Witness 1" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0 }} />
                        ) : (
                           <span>UPLOAD <small>(JPG)</small></span>
                        )}
                        <input type="file" className="photo-upload" name="wit1Signature" accept="image/jpeg, image/jpg" onChange={(e) => setFormData(prev => ({...prev, wit1Signature: e.target.files[0]}))} />
                      </div>
                    </div>
                    <div className="col-4 d-flex align-items-center">
                      <input type="text" name="wit1Name" placeholder="Witness Name" value={formData.wit1Name} readOnly disabled className="form-input w-100" />
                    </div>
                    <div className="col-4 d-flex align-items-center">
                      <input type="text" name="wit1Address" placeholder="Witness Address" value={formData.wit1Address} readOnly disabled className="form-input w-100" />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-4 d-flex align-items-center">
                      <span className="mr-2">2.</span>
                      <div className="sig-upload-inner w-100" style={{height: '50px', position: 'relative', overflow: 'hidden'}}>
                        {formData.wit2Signature ? (
                            <img src={formData.wit2Signature} alt="Witness 2" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0 }} />
                        ) : (
                           <span>UPLOAD <small>(JPG)</small></span>
                        )}
                        <input type="file" className="photo-upload" name="wit2Signature" accept="image/jpeg, image/jpg" onChange={(e) => setFormData(prev => ({...prev, wit2Signature: e.target.files[0]}))} />
                      </div>
                    </div>
                    <div className="col-4 d-flex align-items-center">
                      <input type="text" name="wit2Name" placeholder="Witness Name" value={formData.wit2Name} readOnly disabled className="form-input w-100" />
                    </div>
                    <div className="col-4 d-flex align-items-center">
                      <input type="text" name="wit2Address" placeholder="Witness Address" value={formData.wit2Address} readOnly disabled className="form-input w-100" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="office-use-section mt-5 border-top pt-4">
                <p className="bold-text">FOR OFFICE USE ONLY</p>
                <p>1.Detail of payment of subscription</p>
                <div className="office-tables d-flex gap-3 mt-3">
                  <table className="ebf-table border-table">
                    <thead>
                      <tr>
                        <th colSpan="6" className="text-center">EBF</th>
                      </tr>
                      <tr>
                        <th>I</th><th>II</th><th>III</th><th>IV</th><th>V</th><th>VI</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><input type="text" disabled/></td><td><input type="text" disabled/></td><td><input type="text" disabled/></td><td><input type="text" disabled/></td><td><input type="text" disabled/></td><td><input type="text" disabled/></td>
                      </tr>
                      <tr>
                        <td><input type="text" disabled/></td><td><input type="text" disabled/></td><td><input type="text" disabled/></td><td><input type="text" disabled/></td><td><input type="text" disabled/></td><td><input type="text" disabled/></td>
                      </tr>
                      <tr>
                        <td><input type="text" disabled/></td><td><input type="text" disabled/></td><td><input type="text" disabled/></td><td><input type="text" disabled/></td><td><input type="text" disabled/></td><td><input type="text" disabled/></td>
                      </tr>
                    </tbody>
                  </table>
                  <table className="ebf-table border-table h-100">
                    <thead>
                      <tr>
                        <th>EBF VII</th><th>LUMSUM</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Amount</td><td><input type="text" disabled/></td>
                      </tr>
                      <tr>
                        <td>EBF No</td><td><input type="text" disabled/></td>
                      </tr>
                      <tr>
                        <td>Date</td><td><input type="text" disabled/></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 mb-4 lh-2 text-center">
                  2. Application admitted nomination approved and the TNEB Engineer's Benevolent Fund<br/>
                  membership number allotted in EBF VII no. <input type="text" className="inline-input w-20" name="officeEbfViiNo" value={formData.officeEbfViiNo || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} /> Date <input type="date" className="inline-input w-20" name="officeDate" value={formData.officeDate || ''} readOnly style={{ color: 'black', fontWeight: 'bold' }} />
                </div>

                <div className="notes-section mt-3 text-center">
                  <div className="bold-text">Note :</div>
                  <div className="mt-2">
                    1. EBF-VII Subscription Amount Rs.15,000/- Admission Fee : Rs.3, The Following balance<br/>
                    Subscription for those who are moving from existing EBF Schemes Which shall be<br/>
                    payable in one lumpsum.
                  </div>
                </div>
              </div>

            </div>
            
            <div className="text-center mt-5 mb-2">
               <strong>- 2 -</strong>
            </div>
          </div>
          
          <div className="text-center p-4">
             
          </div>
        
      </div>
    </div>
  );
};
