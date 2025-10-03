import { useState } from 'react';
import './ModalContainer.css';
import SkillsModal from './SkillsModal/SkillsModal.jsx';
import FolioModal from './folioModal/Folio.jsx';
import AboutModal from './About/about.jsx'

function ModalContainer() {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (modalName) => {
        console.log('Opening Modal: ', modalName);
        setActiveModal(modalName);
    };

    const closeModal = () => {
        console.log('Closing modal');
        setActiveModal(null);
    };

    if (typeof window !== 'undefined') {
        window.openModal = openModal;
    }

    return (
        <>
            {/* About Modal */}
            {activeModal === 'about' && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content-wrapper">
                        <div className="modal-content" id="about-modal" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close-btn" onClick={closeModal}>Close</button>
                            <AboutModal />
                        </div>
                    </div>
                </div>
            )}

            {/* Skills Modal */}
            {activeModal === 'skills' && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content-wrapper">
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close-btn" onClick={closeModal}>Close</button>
                            <SkillsModal />
                        </div>
                    </div>
                </div>
            )}

            {/* Portfolio Modal */}
            {activeModal === 'portfolio' && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content-wrapper">
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close-btn" onClick={closeModal}>Close</button>
                            <FolioModal />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ModalContainer;