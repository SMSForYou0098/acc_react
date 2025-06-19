import React,{memo,lazy,Suspense} from 'react'
const Index = lazy(() => import('../views/dashboard/index'))
const HorizontalMulti2Router = memo(() => {
    return (
        <Suspense fallback={<div className="react-load"></div>}>
            <Index />
        </Suspense>
    )
}
)

HorizontalMulti2Router.displayName="HorizontalMulti2Router"
export default HorizontalMulti2Router
