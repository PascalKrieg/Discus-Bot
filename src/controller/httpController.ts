

export interface HttpController {
    loadFromPlugins() : void;
    startListening(port : number) : void;
}