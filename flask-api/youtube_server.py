#!flask/bin/python
import json
from flask import Flask, jsonify, request
import requests

from decorators import *

app = Flask(__name__)


@app.route('/api/fetchlink', methods=['GET'])
@cross_domain(origin='*')
def fetch_link():
    """
    Get the download link for a YouTube video.
    Uses the YoutubeinMP3 API.
    """
    video_link = request.args.get('video')

    if not video_link:
        return jsonify({
            'status': 'FAIL',
            'message': 'Cannot fetch download link without video link',
        })

    try:
        response = requests.get(
            url='http://youtubeinmp3.com/fetch',
            params={
                'format': 'JSON',
                'video': video_link,
            }
        )
        data = json.loads(response.text)
    except Exception as e:
        return jsonify({
            'status': 'FAIL',
            'message': e.message,
        })

    return jsonify({
        'status': 'SUCCESS',
        'message': 'Successfully parsed video link',
        'data': data['link']
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0')
