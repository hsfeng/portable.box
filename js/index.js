(function(root, $, _, Dropbox) {'use strict';

	var gui = require('nw.gui'),
		fs = require('fs');

	gui.App.addOriginAccessWhitelistEntry("https://www.dropbox.com", "app", "htdocs", true);


	var client = new Dropbox.Client({
		key : 'pg3jydep67ckz3e'
	});

	client.authDriver(new Dropbox.AuthDriver.Redirect(
	{
		rememberUser: true,
    	redirectUrl: 'app://htdocs/index.html'
	}));

	var syncDrive = function(drive) {
		localStorage.drive = drive;
		
		$('.entry').hide();
		$('.disk').show();
		$('.alert').hide();
		$('.disk').html(drive);

		//
		client.authenticate({
			interactive : true
		}, function(error, client) {
			if (error) {
				// Replace with a call to your own error-handling code.
				//
				// Don't forget to return from the callback, so you don't execute the code
				// that assumes everything went well.
				console.log(error);
				return;
			}

			//Dropbox.AuthDriver.ChromeExtension.oauthReceiver();

			client.getAccountInfo(function(error, accountInfo) {
				if (error) {
					console.log(error);
					// Something went wrong.
					return;
				}

				$('.profile').html(accountInfo.name);
			});

			client.readdir('/', function(error, entries, stat, stats) {
				if (error) {
					console.log(error);
					// Something went wrong.
					return;
				}

				var writeFileToDisk = function(file, data){

					var buffer = new Buffer(data.byteLength);
					var view = new Uint8Array(data);
					for (var i = 0; i < buffer.length; ++i) {
						buffer[i] = view[i];
					}
					fs.writeFileSync(drive + file, buffer);

				}, readFileFormDropbox = function(file) {
					//console.log(fileEntry);

					client.readFile(file, {
						arrayBuffer: true
					}, function(error, data) {
						if (error) {
							console.log(error);
							// Something went wrong.
							return;
						}

						writeFileToDisk(file, data);
					});
				};

				for (var s in stats) {
					if (stats[s].isFile) {
						//console.log(stats[s]);
						var wp = stats[s].path;

						$('.dropbox').append($('<li>' + wp + '</li>'));

						readFileFormDropbox(wp);

						/*folderEntry.getFile(wp.substring(1), {
							create : true
						}, readFileFormDropbox);
						*/
					}
				}
			});

		});
	};

	document.querySelector('.chooseEntry').addEventListener("change", function(evt) {
		syncDrive(this.value);
	}, false);


	if(localStorage.drive){
		syncDrive(localStorage.drive);
	}else{
		$('.chooseEntry').click();
	}


})(this, this.$, this._, this.Dropbox);
