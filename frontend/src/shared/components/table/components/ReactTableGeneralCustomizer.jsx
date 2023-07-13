import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Collapse, Row} from 'reactstrap';
import DownIcon from 'mdi-react/ChevronDownIcon';
import ReactTableCustomizerToggle from "./ReactTableCustomizerToggle";

const ReactTableGeneralCustomizer = ({
    buttonText,
    titleText = null,
    arrayTableCustomizerSingleToggle
    }) => {

    const [collapse, setCollapse] = useState(false);

    const handleOpen = () => {
        setCollapse(!collapse);
    };

    return (
        <Row className="react-table__customizer">
            <div className="table__collapse">
                <button className="table__btn" type="button" onClick={handleOpen}>
                    <h5>{buttonText}</h5>
                    <DownIcon className="table__icon" />
                </button>
                {collapse && <button className="table__collapse-back" type="button" onClick={handleOpen} />}
                <Collapse
                    isOpen={collapse}
                    className="table__collapse-content"
                >
                    {titleText && <div className="table__collapse-title-wrap">
                        <p>{titleText}</p>
                    </div>}
                    <div className="table__collapse-item">
                        {arrayTableCustomizerSingleToggle.map(item => (
                            <ReactTableCustomizerToggle
                                key={item.id}
                                text={item.text}
                                handleClick={item.func}
                                isChecked={item.isChecked}
                            />
                        ))}
                    </div>
                </Collapse>
            </div>
        </Row>
    );
};

ReactTableGeneralCustomizer.propTypes = {
    buttonText:PropTypes.string,
    titleText:PropTypes.string,
    arrayTableCustomizerSingleToggle:PropTypes.arrayOf(
        PropTypes.shape({
                id: PropTypes.number.isRequired,
                text:PropTypes.string.isRequired,
                func:PropTypes.func.isRequired,
                isChecked:PropTypes.bool.isRequired
            }
        ).isRequired
    ).isRequired
};

ReactTableGeneralCustomizer.defaultProps = {
    buttonText : "Table customizer",
    arrayTableCustomizerSingleToggle:[]
};

export default ReactTableGeneralCustomizer;
