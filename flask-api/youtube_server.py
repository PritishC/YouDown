#!flask/bin/python
from flask import Flask, request, jsonify, make_response
import requests

from decorators import *

app = Flask(__name__)


@app.route('/api/fetchlink', methods=['GET'])
@cross_domain(origin='*')
def fetch_link():
    """
    Get the download link for a YouTube video.
    Uses the YoutubeinMP3 API. Serves the MP3
    file as an attachment.
    """
    video_link = request.args.get('video')

    if not video_link:
        return jsonify({
            'status': 'FAIL',
            'message': 'Cannot fetch download link without video link',
        })

    try:
        audio_response = requests.get(
            requests.get(
                url='http://youtubeinmp3.com/fetch/',
                params={
                    'api': 'advanced',
                    'format': 'JSON',
                    'video': video_link,
                }
            ).json()['link']
        )
    except Exception as e:
        return jsonify({
            'status': 'FAIL',
            'message': e.message,
        })

    response = make_response(audio_response.content)
    response.headers['Content-Type'] = audio_response.headers['content-type']
    response.headers['Content-Disposition'] = audio_response.headers['content-disposition']
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0')
