describe('Youtube Client', function(){
  var YoutubeClient;
  beforeEach(module('youDown.services'));

  beforeEach(inject(function(_YoutubeClient_){
    YoutubeClient = _YoutubeClient_;
  }));

  it('has GAPI client as undefined', inject(function(YoutubeClient){
    // The gapi object is not populated until much later
    expect(YoutubeClient.client).toBeUndefined();
  }));
});
