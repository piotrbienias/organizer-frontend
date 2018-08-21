import React from 'react';
import qs from 'qs';
import {
    Row,
    Icon
} from 'antd';

import {
    Link
} from 'react-router-dom';

import StorageAPI from './api/StorageAPI';


class Storage extends React.Component {

    constructor(props) {
        super(props);

        var queryParams = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });

        this.state = {
            directory: queryParams.directory ? queryParams.directory : '',
            files: [],
            folders: [],
            objects: []
        };

        this.props.history.listen((location, action) => {
            this.setDirectory(location);
        });
    }

    setDirectory = (location) => {
        var queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });

        this.setState({ directory: queryParams.directory ? queryParams.directory : '' });
    }

    componentWillMount() {
        this.getObjects();
    }

    componentDidUpdate(prevProps, prevState) {
        if ( prevState.directory !== this.state.directory ) {
            this.getObjects();
        }
    }

    getObjects() {
        StorageAPI.getObjects(this.state.directory).then(response => {
            this.setState({ files: response.data.files, folders: response.data.folders });
            this.renderObjects();
        });
    }

    renderObjects = () => {
        var tempObjects = [];

        this.state.folders.forEach(folder => {
            tempObjects.push(
                <div key={folder.name} className="single-object">
                    <Icon type="folder" key={folder.name} />
                    <p><Link to={`/pliki?directory=${folder.name}`}>{folder.name}</Link></p>
                </div>
            );
        });

        this.state.files.forEach(file => {
            tempObjects.push(
                <div key={file.name} className="single-object">
                    <Icon type="file" key={file.name} />
                    <p>{file.name}</p>
                </div>
            );
        });

        this.setState({ objects: tempObjects });
    }

    getHTMLObjects = () => {
        return this.state.objects;
    }

    render() {
        console.log('rerender');

        return (
            <Row>
                <Row></Row>
                <Row>{this.getHTMLObjects()}</Row>
            </Row>
        );
    }

}


export default Storage;