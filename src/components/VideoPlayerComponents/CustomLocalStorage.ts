import { LocalMediaStorage,SerializedVideoQuality } from "@vidstack/react";

const getStorageObject = (key: string,subKey:string) => {
    const storage = localStorage.getItem(key);
    return storage ? JSON.parse(storage)[subKey] : null;
};

const setStorageObject = (key: string,subKey:string, value: any) => {
    const storage = localStorage.getItem(key);
    const storageObj = storage ? JSON.parse(storage) : {};
    storageObj[subKey] = value;
    localStorage.setItem(key , JSON.stringify(storageObj));
}

export class CustomLocalStorage extends LocalMediaStorage{
    private key:string;
    private epId:string;

    constructor(key:string,epId:string){
        super();
        this.key = key;
        this.epId = epId;
    }
    getVolume(): Promise<number | null> {
        const volume = getStorageObject(this.key,'volume');
        return Promise.resolve(volume);
    }
    setVolume(volume: number): Promise<void> {
        setStorageObject(this.key,'volume',volume);
        return Promise.resolve();
    }
    getMuted(): Promise<boolean | null> {
        const muted = getStorageObject(this.key,'muted');
        return Promise.resolve(muted);
    }
    setMuted(muted: boolean): Promise<void> {
        setStorageObject(this.key,'muted',muted);
        return Promise.resolve();
    }
    getPlaybackRate(): Promise<number | null> {
        const playbackRate = getStorageObject(this.key,'playbackRate');
        return Promise.resolve(playbackRate);
    }
    setPlaybackRate(rate: number): Promise<void> {
        setStorageObject(this.key,'playbackRate',rate);
        return Promise.resolve();
    }
    getVideoQuality(): Promise<SerializedVideoQuality | null> {
        const videoQuality = getStorageObject(this.key,'videoQuality');
        return Promise.resolve(videoQuality);
    }
    setVideoQuality(videoQuality: SerializedVideoQuality): Promise<void> {
        setStorageObject(this.key,'videoQuality',videoQuality);
        return Promise.resolve();
    }
    getLang(): Promise<string | null> {
        const lang = getStorageObject(this.key,'lang');
        return Promise.resolve(lang);
    }

    setLang(lang: string): Promise<void> {
        setStorageObject(this.key,'lang',lang);
        return Promise.resolve();
    }
    getCaptions(): Promise<boolean | null> {
        const captions = getStorageObject(this.key,'captions');
        return Promise.resolve(captions);
    }
    
    setCaptions(enabled: boolean): Promise<void> {
        setStorageObject(this.key,'captions',enabled);
        return Promise.resolve();
    }
    
    getAudioGain(): Promise<number | null> {
        const audioGain = getStorageObject(this.key,'audioGain');
        return Promise.resolve(audioGain);
    }
    
    setAudioGain(gain: number): Promise<void> {
        setStorageObject(this.key,'audioGain',gain);
        return Promise.resolve();
    }
    getTime(): Promise<number | null> {
        const time = getStorageObject(this.key,'time') || {};
        return Promise.resolve(time[this.epId] || 0);
    }
    private debounce = false;
    setTime(time: number, ended: boolean): Promise<void> {
        if(ended){
            const timeObj = getStorageObject(this.key,'time') || {};
            delete timeObj[this.epId];
            setStorageObject(this.key,'time',timeObj);
            return Promise.resolve();
        }
        if(this.debounce)
            return Promise.resolve();
        const timeObj = getStorageObject(this.key,'time') || {};

        timeObj[this.epId] = time;
        setStorageObject(this.key,'time',timeObj);

        this.debounce = true;
        setTimeout(()=>{
            this.debounce = false;
        },1000);
        return Promise.resolve();
    }
}