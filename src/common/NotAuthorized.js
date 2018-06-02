import React from 'react';
import { Card, Row, Col } from 'antd';

class NotAuthorized extends React.Component {

    static NOT_AUTHORIZED_FOR_SECTION = 'Nie masz uprawnień do otworzenia tej sekcji';
    static CARD_TITLE = 'Brak uprawnień';

    render() {
        return (
            <Row
                style={{ marginTop: '20%' }}>
                <Col
                    span={8}
                    offset={8}
                    style={{ display: 'flex', alignItems: 'center' }}>
                    <Card
                        title={NotAuthorized.CARD_TITLE}
                        extra={<a href="/">Wróc</a>}>
                        <p
                            style={{ textAlign: 'center' }}>{NotAuthorized.NOT_AUTHORIZED_FOR_SECTION}</p>
                    </Card>
                </Col>
            </Row>
        )
    }

}


export default NotAuthorized;