import React from 'react'
import { AdaptableCard, Container } from 'components/shared'

const logData = [
	{
		version: '1.0.3',
		date: '12 Oct 2022',
		updateContent: [
			'[Fix] Menu item collapsing issue in starter pack.',
			'[Fix] ActivityLog filter panel overlap in mobile view.',
			'[Fix] App.js react in jsx scope issue.',
		]
	},
	{
		version: '1.0.2',
		date: '03 Oct 2022',
		updateContent: [
			'[Fix] Notification dropdown down overflow in mobile'
		]
	},
	{
		version: '1.0.1',
		date: '20 Sep 2022',
		updateContent: [
			'[Fix] Redux persistence abnormal.'
		]
	},
	{
		version: '1.0.0',
		date: '15 Sep 2022',
		updateContent: [
			'[Release] Initial Release.'
		]
	},
]

const Log = props => {
	return (
		<div className={`py-4 ${props.border && 'border-bottom'}`}>
			<div className="flex items-center">
				<h5 className="font-weight-normal mb-0 mr-3">{props.version}</h5>
				<code>{props.date}</code>
			</div>
			<div className="api-container p-0 border-0 mt-3">
				{props.children}
			</div>
		</div>
	)
}

const Changelog = () => {
	return (
		<Container>
            <AdaptableCard>
                <h4>Changelog</h4>
                {
                    logData.map(elm => (
                        <Log key={elm.version} version={`v${elm.version}`} date={elm.date}>
                            {
                                elm.updateContent.length > 0 ? 
                                <ul>
                                    {
                                        elm.updateContent.map((item, i) => (
                                            <li key={i}>- {item}</li>
                                        ))
                                    }
                                </ul>
                                :
                                null
                            }
                        </Log>
                    ))
                }
            </AdaptableCard>
		</Container>
	)
}

export default Changelog